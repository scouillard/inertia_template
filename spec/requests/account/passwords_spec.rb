require 'rails_helper'

RSpec.describe "Account::Passwords", type: :request do
  describe "PATCH /account/password" do
    it "updates the password and redirects to settings" do
      user = create(:user, password: "oldpassword")
      sign_in user

      patch account_password_path, params: {
        current_password: "oldpassword",
        password: "newpassword",
        password_confirmation: "newpassword"
      }

      expect(response).to redirect_to(settings_path)
      expect(response).to have_http_status(:see_other)
    end

    it "re-renders settings with errors when current password is wrong" do
      sign_in create(:user, password: "oldpassword")

      patch account_password_path, params: {
        current_password: "wrongpassword",
        password: "newpassword",
        password_confirmation: "newpassword"
      }

      expect(response).to have_http_status(:unprocessable_content)
      expect(inertia).to render_component("settings/show")
    end

    it "redirects unauthenticated users to login" do
      patch account_password_path, params: {
        current_password: "oldpassword",
        password: "newpassword",
        password_confirmation: "newpassword"
      }

      expect(response).to redirect_to(new_user_session_path)
    end
  end
end
