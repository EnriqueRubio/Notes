# -*- encoding: utf-8 -*-
# stub: mongoid-compatibility 0.6.0 ruby lib

Gem::Specification.new do |s|
  s.name = "mongoid-compatibility".freeze
  s.version = "0.6.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Daniel Doubrovkine".freeze]
  s.date = "2022-08-18"
  s.email = "dblock@dblock.org".freeze
  s.homepage = "http://github.com/mongoid/mongoid-compatibility".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.3.26".freeze
  s.summary = "Compatibility helpers for Mongoid.".freeze

  s.installed_by_version = "3.3.26" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<mongoid>.freeze, [">= 2.0"])
    s.add_runtime_dependency(%q<activesupport>.freeze, [">= 0"])
  else
    s.add_dependency(%q<mongoid>.freeze, [">= 2.0"])
    s.add_dependency(%q<activesupport>.freeze, [">= 0"])
  end
end
