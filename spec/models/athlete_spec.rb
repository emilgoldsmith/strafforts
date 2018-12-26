require 'rails_helper'

RSpec.describe Athlete, type: :model do
  it { should validate_presence_of(:access_token) }

  it { should have_one(:athlete_info) }

  it { should have_many(:activities) }
  it { should have_many(:best_efforts) }
  it { should have_many(:gears) }
  it { should have_many(:heart_rate_zones) }
  it { should have_many(:races) }
  it { should have_many(:subscriptions) }

  let(:athlete) { FactoryBot.build(:athlete) }

  describe '.find_all_by_is_active' do
    it 'should get inactive athletes when searching for inactive athletes' do
      # arrange.
      FactoryBot.build(:athlete_with_public_profile)

      # act.
      items = Athlete.find_all_by_is_active(false)

      # assert.
      items.each do |item|
        expect(item.is_active).to be false
      end
    end

    it 'should get active athletes when searching for active athletes' do
      # arrange.
      FactoryBot.build(:athlete_with_public_profile)

      # act.
      items = Athlete.find_all_by_is_active(true)

      # assert.
      items.each do |item|
        expect(item.is_active).to be true
      end
    end
  end
end
