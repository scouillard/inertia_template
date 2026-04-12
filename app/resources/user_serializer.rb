class UserSerializer < ApplicationResource
  attributes :id, :email, :name, :provider, :role
end
