require 'rails_helper'

RSpec.describe DeauthorizeAthleteWorker, type: :worker do
  it 'should enqueue the job' do
    # act.
    DeauthorizeAthleteWorker.perform_async

    # assert.
    expect(DeauthorizeAthleteWorker).to have_enqueued_sidekiq_job
    expect(DeauthorizeAthleteWorker).to save_backtrace
    expect(DeauthorizeAthleteWorker).to be_retryable 0
  end

  it 'should raise ArgumentError when access_token is blank' do
    # act & assert.
    expect {
      Sidekiq::Testing.inline! do
        DeauthorizeAthleteWorker.perform_async('')
      end
    }.to raise_error(ArgumentError, 'DeauthorizeAthleteWorker - Access token is blank.')
  end

  it 'should perform the action' do
    # arrange.
    token_refresh_response_body = {:access_token => ACCESS_TOKEN, :refresh_token => '1234567898765432112345678987654321', :expires_at => 1531385304 }.to_json
    stub_strava_post_request(Settings.strava.api_auth_token_url, TOKEN_REFRESH_REQUEST_BODY, 200, token_refresh_response_body)
    stub_strava_post_request(Settings.strava.api_auth_deauthorize_url, {:access_token => ACCESS_TOKEN }, 200)

    # act.
    Sidekiq::Testing.inline! do
      DeauthorizeAthleteWorker.perform_async(ACCESS_TOKEN)
    end

    # assert.
    expect(Athlete.find_by(id: 111)).to be_nil
  end
end
