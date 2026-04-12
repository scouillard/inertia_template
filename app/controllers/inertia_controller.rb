# frozen_string_literal: true

class InertiaController < ApplicationController
  inertia_share current_user: -> { UserResource.new(current_user).serializable_hash if current_user }
  inertia_share unread_notifications_count: -> { current_user&.notifications&.unread&.count || 0 }
  inertia_share notifications: -> {
    next [] unless current_user
    NotificationResource.new(current_user.notifications.newest_first.limit(20).includes(:event)).serializable_hash
  }
end
