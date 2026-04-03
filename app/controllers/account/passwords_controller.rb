class Account::PasswordsController < InertiaController
  def update
    if current_user.update_with_password(password_params)
      bypass_sign_in(current_user)

      redirect_to settings_path, notice: "Password updated successfully.", status: :see_other
    else
      render inertia: "settings/show", props: {
        errors: current_user.errors.messages.transform_values(&:first)
      }, status: :unprocessable_entity
    end
  end

  private

  def password_params
    params.permit(:current_password, :password, :password_confirmation)
  end
end
