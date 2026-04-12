class InvitationSerializer < ApplicationResource
  attributes :id, :email, :created_at, :expires_at, :token
end
