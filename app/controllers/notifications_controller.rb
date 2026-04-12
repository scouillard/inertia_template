# frozen_string_literal: true

class NotificationsController < InertiaController
  def mark_all_read
    current_user.notifications.unread.mark_as_read
    redirect_back_or_to root_path, status: :see_other
  end
end
