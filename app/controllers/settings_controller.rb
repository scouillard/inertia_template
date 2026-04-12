class SettingsController < InertiaController
  def show
    users = User.order(:name).sort_by { |u| u.role_admin? ? 0 : 1 }
    pending_invitations = Invitation.unaccepted.order(:created_at)
    render inertia: "settings/show", props: {
      users: UserSerializer.new(users).serializable_hash,
      pending_invitations: InvitationSerializer.new(pending_invitations).serializable_hash
    }
  end
end
