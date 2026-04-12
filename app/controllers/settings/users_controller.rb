# frozen_string_literal: true

class Settings::UsersController < InertiaController
  before_action :require_admin!
  before_action :set_user
  before_action :prevent_self_action

  def update
    if @user.update(user_params)
      redirect_to settings_path, notice: "#{@user.name}'s role updated to #{@user.role}.", status: :see_other
    else
      redirect_to settings_path, alert: @user.errors.full_messages.first, status: :see_other
    end
  end

  def destroy
    @user.destroy!
    redirect_to settings_path, notice: "#{@user.name} has been removed from the team.", status: :see_other
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def prevent_self_action
    head :forbidden if @user == current_user
  end

  def user_params
    params.permit(:role)
  end
end
