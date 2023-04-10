class Friendship
  include Mongoid::Document
  include Mongoid::Timestamps

  field :status, type: String

  belongs_to :sender, class_name: "User"
  belongs_to :receiver, class_name: "User"
end
