require 'rails_helper'

RSpec.describe Invitation, type: :model do
  describe "scopes" do
    it ".unaccepted excludes accepted invitations" do
      pending_inv = create(:invitation)
      create(:invitation, :accepted)

      expect(Invitation.unaccepted).to contain_exactly(pending_inv)
    end

    it ".pending excludes expired invitations" do
      active_inv = create(:invitation)
      create(:invitation, :expired)

      expect(Invitation.pending).to contain_exactly(active_inv)
    end

    it ".pending excludes accepted invitations" do
      active_inv = create(:invitation)
      create(:invitation, :accepted)

      expect(Invitation.pending).to contain_exactly(active_inv)
    end
  end

  describe "#pending?" do
    it "is true when not accepted and not expired" do
      invitation = build(:invitation)
      expect(invitation.pending?).to be true
    end

    it "is false when expired" do
      invitation = create(:invitation, :expired)
      expect(invitation.pending?).to be false
    end

    it "is false when accepted" do
      invitation = build(:invitation, :accepted)
      expect(invitation.pending?).to be false
    end
  end

  describe "#accept!" do
    it "creates a user with the invitation email and marks it accepted" do
      invitation = create(:invitation)

      user = invitation.accept!(name: "New Person", password: "secret123", password_confirmation: "secret123")

      expect(user).to be_persisted
      expect(user.email).to eq(invitation.email)
      expect(invitation.reload.accepted_at).to be_present
    end

    it "raises when user attributes are invalid" do
      invitation = create(:invitation)

      expect {
        invitation.accept!(name: "", password: "secret123", password_confirmation: "secret123")
      }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end

  describe ".find_for_omniauth" do
    it "finds a pending invitation by session token" do
      invitation = create(:invitation)
      auth = OmniAuth::AuthHash.new(provider: "google_oauth2", uid: "123", info: { email: "other@example.com" })

      result = Invitation.find_for_omniauth(auth, session_token: invitation.token)

      expect(result).to eq(invitation)
    end

    it "falls back to email match when session token does not match" do
      invitation = create(:invitation, email: "match@example.com")
      auth = OmniAuth::AuthHash.new(provider: "google_oauth2", uid: "123", info: { email: "match@example.com" })

      result = Invitation.find_for_omniauth(auth, session_token: "wrong-token")

      expect(result).to eq(invitation)
    end

    it "returns nil when neither token nor email matches" do
      auth = OmniAuth::AuthHash.new(provider: "google_oauth2", uid: "123", info: { email: "nobody@example.com" })

      result = Invitation.find_for_omniauth(auth, session_token: nil)

      expect(result).to be_nil
    end
  end

  describe "#accept_with_google!" do
    it "creates a user with the invitation email, provider, and uid, and marks accepted" do
      invitation = create(:invitation, email: "invite@example.com")
      auth = OmniAuth::AuthHash.new(provider: "google_oauth2", uid: "abc123", info: { email: "invite@example.com", name: "Jane Doe" })

      user = invitation.accept_with_google!(auth)

      expect(user).to be_persisted
      expect(user.email).to eq("invite@example.com")
      expect(user.provider).to eq("google_oauth2")
      expect(user.uid).to eq("abc123")
      expect(user.name).to eq("Jane Doe")
      expect(invitation.reload.accepted_at).to be_present
    end

    it "falls back to email prefix when auth name is blank" do
      invitation = create(:invitation, email: "jane@example.com")
      auth = OmniAuth::AuthHash.new(provider: "google_oauth2", uid: "abc123", info: { email: "jane@example.com", name: "" })

      user = invitation.accept_with_google!(auth)

      expect(user.name).to eq("jane")
    end
  end

  describe "#resend!" do
    it "regenerates the token and extends expiry" do
      invitation = create(:invitation)
      original_token = invitation.token
      original_expiry = invitation.expires_at

      travel_to 1.hour.from_now do
        invitation.resend!
      end

      invitation.reload
      expect(invitation.token).not_to eq(original_token)
      expect(invitation.expires_at).to be > original_expiry
    end
  end
end
