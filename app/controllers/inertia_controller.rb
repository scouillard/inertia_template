# frozen_string_literal: true

class InertiaController < ApplicationController
  inertia_share current_user: -> { UserResource.new(current_user).serializable_hash if current_user }
end
