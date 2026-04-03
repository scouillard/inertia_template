class SettingsController < InertiaController
  def show
    users = User.order(:name).sort_by { |u| u.role_admin? ? 0 : 1 }
    render inertia: "settings/show", props: {
      users: users.as_json(only: %i[id name email role])
    }
  end
end
