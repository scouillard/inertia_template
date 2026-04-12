# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Admin.find_or_create_by!(email: 'samuel@myapp.com') do |admin|
  admin.password = 'password1234!'
  admin.password_confirmation = 'password1234!'
end

User.find_or_create_by!(email: 'samuel@myapp.com') do |user|
  user.name = 'Samuel Couillard'
  user.password = 'password1234!'
  user.password_confirmation = 'password1234!'
  user.role = "admin"
end

User.find_or_create_by!(email: 'obie@myapp.com') do |user|
  user.name = 'Obie Trice'
  user.password = 'password1234!'
  user.password_confirmation = 'password1234!'
end

User.find_or_create_by!(email: 'kurt@myapp.com') do |user|
  user.name = 'Kurt Cobain'
  user.password = 'password1234!'
  user.password_confirmation = 'password1234!'
end
