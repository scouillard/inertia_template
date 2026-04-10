# frozen_string_literal: true

class InertiaController < ApplicationController
  inertia_share current_user: -> { current_user&.as_json(only: %i[id email name provider role]) }
end
