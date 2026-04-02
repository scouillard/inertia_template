class SettingsController < InertiaController
  def show
    render inertia: "settings/show"
  end
end
