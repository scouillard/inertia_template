# frozen_string_literal: true

class UsersController < InertiaController
  before_action :require_admin!
  before_action :set_user
  before_action :prevent_self_action

  def update
    if @user.update(user_params)
      redirect_to settings_path, notice: "#{@user.name}'s role updated to #{@user.role}."
    else
      redirect_to settings_path, alert: @user.errors.full_messages.first
    end
  end

  def destroy
    @user.destroy!
    redirect_to settings_path, notice: "#{@user.name} has been removed from the team."
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
