class PasswordsController < Devise::PasswordsController
  skip_before_action :authenticate_user!
  rate_limit to: 5, within: 1.minute, only: :create, with: -> {
    render inertia: "auth/forgot-password", props: { errors: { email: "Too many requests. Please try again later." } }, status: :too_many_requests
  }

  def new
    render inertia: "auth/forgot-password"
  end

  def create
    user = User.find_by(email: params.dig(:user, :email))
    user&.send_reset_password_instructions
    render inertia: "auth/forgot-password", props: { sent: true }
  end
end
