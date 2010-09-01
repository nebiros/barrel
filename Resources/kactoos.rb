require "rubygems"
require "httparty"

module Kactoos
  class Base
    include HTTParty
    # BASE_URI
    BASE_URI = "http://www.kactoos.com/api/".freeze
    # set httparty base uri.
    base_uri BASE_URI

    # Makes url query string path.
    #
    # @param [String] path
    # @param [Hash] options
    # @return [String]
    def path( path, options = {} )
      raise ArgumentError, "options must be a hash" unless options.is_a?( Hash )
      options = options.clone; f = options[:format] && options[:format].to_s || "json"
      self.class.format( f.to_sym ); options.delete( :format )
      qs = to_query( options )
      qs = qs.length > 0 ? "&#{qs}" : nil
      path += "?format=#{f}&appName=#{@app_name}&apiKey=#{@api_key}#{qs}"
      path.chomp!
      path
    end

    # Convert a Hash object into a query string.
    #
    # @param [Hash] hash
    # @return [String]
    def to_query( hash )
      params = ""
      stack = []

      hash.each do |k, v|
        if v.is_a?( Hash )
          stack << [k, v]
        elsif v.is_a?( Array )
          stack << [k, from_array( v )]
        else
          params << "#{k}=#{v}&"
        end
      end

      stack.each do |parent, hash|
        hash.each do |k, v|
          if v.is_a?( Hash )
            stack << ["#{parent}[#{k}]", v]
          else
            params << "#{parent}[#{k}]=#{v}&"
          end
        end
      end

      params.chop!
      params
    end

    # Converts an Array object into a Hash object.
    #
    # @param [Array] array
    # @return [Hash]
    def self.from_array( array = [] )
      h = Hash.new
      array.size.times do |t|
        h[t] = array[t]
      end
      h
    end
  end

  # Product.
  class Product < Base
    def initialize( app_name, api_key )
      @app_name, @api_key = app_name, api_key
    end

    # List products, of get information for just one.
    #
    # @param [Hash] options
    # @return [Hash]
    def list( options = {} )
      options[:search] = options[:search] && options[:search].to_s || nil
      options[:start] = options[:start] && options[:start].to_i || 0
      options[:limit] = options[:limit] && options[:limit].to_i || 10
      options[:imageWidth] = options[:imageWidth] && options[:imageWidth].to_i || 200
      options[:description] = options[:imageWidth] && options[:imageWidth].to_i || 0
      options[:idProduct] = options[:idProduct] && options[:idProduct].to_i || nil
      options[:orderBy] = options[:orderBy] && options[:orderBy].to_s || nil
      options[:category] = options[:category] && options[:category].to_i || nil

      begin
        response = self.class.get(
          path( "/products/get-product-list", options )
        )
      rescue Exception => e
        raise e
      end

      response["products"] || {}
    end

    # Get product users.
    #
    # @param [Hash] options
    # @return [Hash]
    def users( options = {} )
      raise ArgumentError, "idProduct must be a number and can't be empty" unless options[:idProduct] && options[:idProduct].is_a?( Integer )

      begin
        response = self.class.get(
          path( "/products/get-product-users", options )
        )
      rescue Exception => e
        raise e
      end

      response["users"] || {}
    end

    # Get categories.
    #
    # @param [Hash] options
    # @return [Hash]
    def categories( options = {} )
      begin
        response = self.class.get(
          path( "/products/get-product-categories", options )
        )
      rescue Exception => e
        raise e
      end

      # XXX: api docs are wrong, doesn't return a 'categories' key instead 'arrCategorias'.
      response["arrCategorias"] || {}
    end
  end
end

product = Kactoos::Product.new( "jfalvarez", "dfgllej4jh67699001kkvjjfr" )
puts "=" * 20
product.list().each do |item|
  puts "#{item["id_producto"]} -- #{item["nombre_producto"]}"
end
puts "=" * 20
product.users( { :idProduct => 202 } ).each do |user|
  puts "#{user["nombre"]} -- #{user["apellido"]}"
end
puts "=" * 20
product.categories().each do |cat|
  puts "#{cat["id_categoria"]} -- #{cat["nombre_categoria_en"]}"
end
