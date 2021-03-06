require 'rails_helper'

RSpec.describe AthleteInfo, type: :model do
  it { should belong_to(:athlete) }
  it { should belong_to(:city) }
  it { should belong_to(:state) }
  it { should belong_to(:country) }

  describe '.find_by_email' do
    let(:athlete_id) { '98765' }

    it 'should get nil when the provided email matches nothing' do
      # arrange.
      FactoryBot.build(:athlete_with_public_profile, id: athlete_id)

      # act.
      item = AthleteInfo.find_by_email('should_not_exist@example.com')

      # assert.
      expect(item).to be_nil
    end

    it 'should get an athlete matching the provided email' do
      # arrange.
      athlete = FactoryBot.build(:athlete_with_public_profile, id: athlete_id)

      # act.
      item = AthleteInfo.find_by_email(athlete.athlete_info.email)

      # assert.
      expect(item.is_a?(AthleteInfo)).to be true
      expect(item.email).to eq(athlete.athlete_info.email)
    end
  end
end
