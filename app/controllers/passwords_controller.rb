class PasswordsController < Devise::PasswordsController
  skip_before_action :authenticate_user!

  def new
    render inertia: "auth/forgot-password"
  end

  def create
    user = User.find_by(email: params.dig(:user, :email))
    user&.send_reset_password_instructions
    render inertia: "auth/forgot-password", props: { sent: true }
  end
end
