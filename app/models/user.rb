class User
    include Mongoid::Document

    #has_secure_password

    field :username, type: String
    field :email, type: String
    field :password, type: String
    field :admin, type: Boolean

    validates_presence_of :username, :email, :password, :admin
    validates_uniqueness_of :email   
end