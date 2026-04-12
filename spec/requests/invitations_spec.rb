require 'rails_helper'

RSpec.describe "Invitations", type: :request do
  describe "POST /invitations" do
    context "as an admin" do
      before do
        @admin = create(:user, :admin)
        sign_in @admin
      end

      it "creates an invitation, enqueues a mailer, and redirects to settings" do
        expect {
          post invitations_path, params: { email: "new@example.com" }
        }.to have_enqueued_mail(UserMailer, :invitation)

        expect(response).to redirect_to(settings_path)
        expect(response).to have_http_status(:see_other)
        expect(Invitation.find_by(email: "new@example.com")).to be_present
      end

      it "re-renders settings with errors when email is invalid" do
        post invitations_path, params: { email: "not-an-email" }

        expect(response).to have_http_status(:unprocessable_content)
        expect(inertia).to render_component("settings/show")
      end

      it "re-renders settings with an error when email belongs to an existing user" do
        create(:user, email: "existing@example.com")

        post invitations_path, params: { email: "existing@example.com" }

        expect(response).to have_http_status(:unprocessable_content)
        expect(inertia).to render_component("settings/show")
        expect(inertia).to have_props(errors: { email: "belongs to an existing member" })
      end

      it "re-renders settings with an error when a pending invitation already exists for that email" do
        create(:invitation, email: "pending@example.com")

        post invitations_path, params: { email: "pending@example.com" }

        expect(response).to have_http_status(:unprocessable_content)
        expect(inertia).to render_component("settings/show")
        expect(inertia).to have_props(errors: { email: "already has a pending invitation" })
      end
    end

    it "forbids a non-admin" do
      sign_in create(:user)

      post invitations_path, params: { email: "new@example.com" }

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "GET /invitations/:token" do
    it "renders the invitation page for a pending invitation" do
      invitation = create(:invitation)

      get invitation_path(invitation.token)

      expect(inertia).to render_component("invitations/show")
      expect(inertia).to have_props(email: invitation.email, token: invitation.token)
    end

    it "redirects when invitation is expired" do
      invitation = create(:invitation, :expired)

      get invitation_path(invitation.token)

      expect(response).to redirect_to(new_user_session_path)
    end

    it "redirects when invitation is already accepted" do
      invitation = create(:invitation, :accepted)

      get invitation_path(invitation.token)

      expect(response).to redirect_to(new_user_session_path)
    end

    it "redirects when token is not found" do
      get invitation_path("nonexistent-token")

      expect(response).to redirect_to(new_user_session_path)
    end
  end

  describe "POST /invitations/:token/google" do
    it "renders an auto-submit form for Google OAuth" do
      invitation = create(:invitation)

      post google_invitation_path(invitation.token)

      expect(response).to have_http_status(:ok)
      expect(response.body).to include(user_google_oauth2_omniauth_authorize_path)
    end

    it "redirects when invitation is not pending" do
      invitation = create(:invitation, :expired)

      post google_invitation_path(invitation.token)

      expect(response).to redirect_to(new_user_session_path)
    end
  end

  describe "PATCH /invitations/:token" do
    it "accepts the invitation, signs in the new user, and redirects" do
      invitation = create(:invitation)

      patch invitation_path(invitation.token), params: {
        name: "New Person",
        password: "secret123",
        password_confirmation: "secret123"
      }

      expect(response).to redirect_to(root_path)
      expect(response).to have_http_status(:see_other)
      expect(invitation.reload.accepted_at).to be_present
    end

    it "re-renders with errors when user params are invalid" do
      invitation = create(:invitation)

      patch invitation_path(invitation.token), params: {
        name: "",
        password: "secret123",
        password_confirmation: "secret123"
      }

      expect(response).to have_http_status(:unprocessable_content)
      expect(inertia).to render_component("invitations/show")
    end

    it "redirects when invitation is not pending" do
      invitation = create(:invitation, :expired)

      patch invitation_path(invitation.token), params: {
        name: "New Person",
        password: "secret123",
        password_confirmation: "secret123"
      }

      expect(response).to redirect_to(new_user_session_path)
    end
  end

  describe "DELETE /invitations/:token" do
    it "destroys the invitation and redirects" do
      admin = create(:user, :admin)
      sign_in admin
      invitation = create(:invitation, invited_by: admin)

      delete invitation_path(invitation.token)

      expect(response).to redirect_to(settings_path)
      expect(response).to have_http_status(:see_other)
      expect(Invitation.exists?(invitation.id)).to be false
    end

    it "forbids a non-admin" do
      sign_in create(:user)
      invitation = create(:invitation)

      delete invitation_path(invitation.token)

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "POST /invitations/:token/resend" do
    it "resends the invitation, enqueues a mailer, and redirects" do
      admin = create(:user, :admin)
      sign_in admin
      invitation = create(:invitation, invited_by: admin)

      expect {
        post resend_invitation_path(invitation.token)
      }.to have_enqueued_mail(UserMailer, :invitation)

      expect(response).to redirect_to(settings_path)
      expect(response).to have_http_status(:see_other)
    end

    it "forbids a non-admin" do
      sign_in create(:user)
      invitation = create(:invitation)

      post resend_invitation_path(invitation.token)

      expect(response).to have_http_status(:forbidden)
    end
  end
end
