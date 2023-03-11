class User
  include Mongoid::Document

  field :username, type: String
  field :email, type: String
  field :password, type: String
  field :admin, type: Boolean

  validates_presence_of :username, :email, :password, :admin
end