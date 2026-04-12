require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe "POST /users/sign_in" do
    it "signs in with valid credentials and redirects to root" do
      user = create(:user, password: "password123")

      post user_session_path, params: { user: { email: user.email, password: "password123" } }

      expect(response).to redirect_to(root_path)
      expect(response).to have_http_status(:see_other)
    end

    it "re-renders login with error on invalid credentials" do
      post user_session_path, params: { user: { email: "wrong@example.com", password: "bad" } }

      expect(response).to have_http_status(:unprocessable_content)
      expect(inertia).to render_component("auth/login")
      expect(inertia).to have_props(errors: { email: "Invalid email or password." })
    end
  end

  describe "DELETE /users/sign_out" do
    it "signs out and redirects to login" do
      sign_in create(:user)

      delete destroy_user_session_path

      expect(response).to redirect_to(new_user_session_path)
      expect(response).to have_http_status(:see_other)
    end
  end
end
