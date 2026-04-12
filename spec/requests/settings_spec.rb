require 'rails_helper'

RSpec.describe "Settings", type: :request do
  describe "GET /settings" do
    it "renders the settings page" do
      sign_in create(:user, :admin)
      create(:invitation)

      get settings_path

      expect(inertia).to render_component("settings/show")
    end

    it "redirects unauthenticated users to login" do
      get settings_path

      expect(response).to redirect_to(new_user_session_path)
    end
  end
end
