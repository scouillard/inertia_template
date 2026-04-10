class SettingsController < InertiaController
  def show
    users = User.order(:name).sort_by { |u| u.role_admin? ? 0 : 1 }
    pending_invitations = Invitation.unaccepted.order(:created_at)
    render inertia: "settings/show", props: {
      users: users.as_json(only: %i[id name email role]),
      pending_invitations: pending_invitations.as_json(only: %i[id email created_at expires_at token])
    }
  end
end
