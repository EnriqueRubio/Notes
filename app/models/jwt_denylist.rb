class JwtDenylist
  include Mongoid::Document
  include Mongoid::Timestamps
  field :jti_string, type: String
  field :exp, type: Time
end
