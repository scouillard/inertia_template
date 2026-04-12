module Madmin
  class ApplicationController < Madmin::BaseController
    before_action :authenticate_admin_user

    def authenticate_admin_user
      # For example, with Rails 8 authentication
      # redirect_to "/", alert: "Not authorized." unless authenticated? && Current.user.admin?

      # Or with Devise
      redirect_to new_admin_session_path, alert: "Not authorized." unless current_admin
    end
  end
end
