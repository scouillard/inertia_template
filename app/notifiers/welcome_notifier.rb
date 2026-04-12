# frozen_string_literal: true

class WelcomeNotifier < ApplicationNotifier
  deliver_by :database

  notification_methods do
    def message
      "Welcome to MyApp! We're glad to have you."
    end
  end
end
