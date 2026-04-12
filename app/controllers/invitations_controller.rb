# frozen_string_literal: true

class InvitationsController < InertiaController
  skip_before_action :authenticate_user!, only: %i[show update google]
  before_action :require_admin!, only: %i[create destroy resend]
  before_action :set_invitation, only: %i[show update google destroy resend]
  before_action :ensure_pending!, only: %i[show update google]

  def create
    invitation = current_user.sent_invitations.build(email: params[:email])

    if invitation.save
      UserMailer.invitation(invitation).deliver_later

      redirect_to settings_path, notice: "Invitation sent to #{invitation.email}.", status: :see_other
    else
      users = User.order(:name).sort_by { |u| u.role_admin? ? 0 : 1 }
      pending_users = Invitation.unaccepted.order(:created_at)

      render inertia: "settings/show", props: {
        users: UserResource.new(users).serializable_hash,
        pending_invitations: InvitationResource.new(pending_users).serializable_hash,
        errors: { email: invitation.errors[:email].first }
      }, status: :unprocessable_content
    end
  end

  def show
    render inertia: "invitations/show", props: {
      email: @invitation.email,
      token: @invitation.token
    }
  end

  def google
    session[:pending_invitation_token] = @invitation.token
    render html: <<~HTML.html_safe
      <!DOCTYPE html>
      <html>
      <body>
        <form id="f" method="post" action="#{user_google_oauth2_omniauth_authorize_path}">
          <input type="hidden" name="authenticity_token" value="#{form_authenticity_token}">
        </form>
        <script>document.getElementById('f').submit()</script>
      </body>
      </html>
    HTML
  end

  def destroy
    @invitation.destroy!
    redirect_to settings_path, notice: "Invitation to #{@invitation.email} was removed.", status: :see_other
  end

  def resend
    @invitation.resend!
    redirect_to settings_path, notice: "Invitation resent to #{@invitation.email}.", status: :see_other
  rescue ActiveRecord::RecordInvalid => e
    redirect_to settings_path, alert: e.record.errors.full_messages.first, status: :see_other
  end

  def update
    user = @invitation.accept!(user_params)

    sign_in(user)

    redirect_to root_path, notice: "Welcome to MyApp!", status: :see_other
  rescue ActiveRecord::RecordInvalid => e
    render inertia: "invitations/show", props: {
      email: @invitation.email,
      token: @invitation.token,
      errors: e.record.errors.messages.transform_values(&:first)
    }, status: :unprocessable_content
  end

  private

  def set_invitation
    @invitation = Invitation.find_by!(token: params[:token])
  rescue ActiveRecord::RecordNotFound
    redirect_to new_user_session_path, alert: "Invitation not found."
  end

  def ensure_pending!
    redirect_to new_user_session_path, alert: "Invitation not found." unless @invitation.pending?
  end

  def user_params
    params.permit(:name, :password, :password_confirmation)
  end
end
