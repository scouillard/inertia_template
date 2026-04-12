class SessionsController < Devise::SessionsController
  skip_before_action :authenticate_user!, only: %i[new create]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> {
    render inertia: "auth/login", props: { errors: { email: "Too many login attempts. Please try again later." } }, status: :too_many_requests
  }

  def new
    render inertia: "auth/login"
  end

  def create
    self.resource = warden.authenticate(auth_options)

    if resource
      resource.remember_me = params.dig(:user, :remember_me) == "1"
      sign_in(resource_name, resource)

      redirect_to after_sign_in_path_for(resource), notice: "Signed in successfully", status: :see_other
    else
      render inertia: "auth/login", props: {
        errors: { email: "Invalid email or password." }
      }, status: :unprocessable_content
    end
  end

  def destroy
    sign_out current_user

    redirect_to new_user_session_path, notice: "Signed out successfully.", status: :see_other
  end

  private

  def after_sign_in_path_for(_resource)
    root_path
  end

  def after_sign_out_path_for(_scope)
    new_user_session_path
  end
end
