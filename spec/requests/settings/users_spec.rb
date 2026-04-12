require 'rails_helper'

RSpec.describe "Settings::Users", type: :request do
  describe "PATCH /settings/users/:id" do
    context "as an admin" do
      before do
        @admin = create(:user, :admin)
        sign_in @admin
      end

      it "updates another user's role and redirects" do
        member = create(:user)

        patch settings_user_path(member), params: { role: "admin" }

        expect(response).to redirect_to(settings_path)
        expect(response).to have_http_status(:see_other)
        expect(member.reload.role).to eq("admin")
      end

      it "forbids updating their own role" do
        patch settings_user_path(@admin), params: { role: "member" }

        expect(response).to have_http_status(:forbidden)
      end
    end

    it "forbids a non-admin" do
      member = create(:user)
      target = create(:user)
      sign_in member

      patch settings_user_path(target), params: { role: "admin" }

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "DELETE /settings/users/:id" do
    context "as an admin" do
      before do
        @admin = create(:user, :admin)
        sign_in @admin
      end

      it "removes the user and redirects" do
        member = create(:user)

        delete settings_user_path(member)

        expect(response).to redirect_to(settings_path)
        expect(response).to have_http_status(:see_other)
        expect(User.exists?(member.id)).to be false
      end

      it "forbids deleting their own account" do
        delete settings_user_path(@admin)

        expect(response).to have_http_status(:forbidden)
      end
    end

    it "forbids a non-admin" do
      member = create(:user)
      target = create(:user)
      sign_in member

      delete settings_user_path(target)

      expect(response).to have_http_status(:forbidden)
    end
  end
end
