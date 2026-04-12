class NotificationResource < ApplicationResource
  attributes :id, :read_at, :created_at

  attribute :message do |notification|
    notification.message
  end
end
