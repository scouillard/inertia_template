require 'rails_helper'

RSpec.describe User, type: :model do
  describe "#initials" do
    it "returns first and last initials for a full name" do
      user = build(:user, name: "John Doe")
      expect(user.initials).to eq("JD")
    end

    it "returns first two characters for a single name" do
      user = build(:user, name: "Prince")
      expect(user.initials).to eq("PR")
    end

    it "uses first and last word when more than two names given" do
      user = build(:user, name: "Mary Jane Watson")
      expect(user.initials).to eq("MW")
    end
  end

  describe ".from_omniauth" do
    it "finds a user by provider and uid" do
      user = create(:user, provider: "google_oauth2", uid: "123")
      auth = OmniAuth::AuthHash.new(provider: "google_oauth2", uid: "123", info: { email: user.email })

      expect(User.from_omniauth(auth)).to eq(user)
    end

    it "falls back to email when uid does not match" do
      user = create(:user, email: "match@example.com", provider: nil, uid: nil)
      auth = OmniAuth::AuthHash.new(provider: "google_oauth2", uid: "new-uid", info: { email: "match@example.com" })

      result = User.from_omniauth(auth)

      expect(result).to eq(user)
      expect(result.provider).to eq("google_oauth2")
      expect(result.uid).to eq("new-uid")
    end

    it "returns nil when no user matches" do
      auth = OmniAuth::AuthHash.new(provider: "google_oauth2", uid: "unknown", info: { email: "nobody@example.com" })
      expect(User.from_omniauth(auth)).to be_nil
    end
  end
end
