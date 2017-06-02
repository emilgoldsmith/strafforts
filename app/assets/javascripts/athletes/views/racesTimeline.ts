/// <reference path="./baseView.ts" />

namespace Views {

    export class RacesTimeline extends BaseView {

        static distances: string[] = [];

        public load(): void {
            const viewUrl = AppHelpers.getBaseUrl() + '/timeline/races';
            super.prepareView(viewUrl, 'Races Timeline');

            this.createViewTemplate();
            this.createView();
        }

        protected createViewTemplate(): void {
            const mainContent = $('#main-content');
            mainContent.empty(); // Empty main content.

            const content = `
                <div class="row">
                    <div class="col-xs-12">${HtmlHelpers.getLoadingIcon()}</div>
                </div>
            `;
            mainContent.append(content);
        }

        protected createView(): void {
            let content = HtmlHelpers.getNoDataInfoBox();

            const years = this.getRaceYears();
            if (years.length > 0) {
                let items = '';
                years.forEach((year) => {
                    items += `
                        <li class="time-label">
                            <span class="bg-strava">${year}</span>
                        </li>
                        ${this.createRacesTimelineForYear(year)}
                    `;
                });

                let distanceFilterButtons = '<button class="btn btn-md hidden show-races-timeline">Show All Distances</button>';
                RacesTimeline.distances.forEach((distanceText) => {
                    distanceFilterButtons += `
                        <button class="btn btn-md race-distance-label">${distanceText}</button>
                    `;
                });

                content = `
                    <div class="timeline-wrapper">
                        <div class="col-xs-12 text-center timeline-filters">
                            ${distanceFilterButtons}
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <ul class="timeline">
                                    ${items}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            }

            const mainContent = $('#main-content');
            mainContent.empty();
            mainContent.append(content);
        }

        protected getRaceYears(): number[] {
            const years: number[] = [];
            $.ajax({
                url: AppHelpers.getApiBaseUrl() + '/races/get_counts_by_year',
                dataType: 'json',
                async: false,
                success: (data) => {
                    $.each(data, (key, value) => {
                        const year = value['race_year'];
                        if ($.inArray(year, years) === -1) {
                            years.push(year);
                        }
                    });
                },
            });
            return years;
        }

        protected createRacesTimelineForYear(year: number): string {
            let content = '';
            $.ajax({
                url: AppHelpers.getApiBaseUrl() + '/races/' + year,
                dataType: 'json',
                async: false,
                success: (data) => {
                    const races: any[] = [];
                    $.each(data, (key, value) => {
                        races.push(value);
                    });
                    races.forEach((item) => {
                        const stravaLink = `https://www.strava.com/activities/${item['activity_id']}`;

                        let distanceId = item['race_distance'].toLowerCase().replace(/\s/g, '-');
                        if (RacesTimeline.distances.indexOf(item['race_distance']) == -1) {
                            RacesTimeline.distances.push(item['race_distance']);
                        }

                        let cadence = '';
                        if (item['cadence'] !== '') {
                            cadence = `
                            <div class="activity-data">
                                <strong>Cadence: </strong>${item['cadence']}
                            </div>
                        `;
                        }

                        content += `
                            <li>
                                <i class="fa fa-trophy"></i>
                                <div class="timeline-item race-distance-${distanceId}">
                                    <span class="time"><i class="fa fa-clock-o"></i>${item['start_date']}</span>
                                    <h3 class="timeline-header">
                                        <a href="${stravaLink}" target="_blank">${item['activity_name']}</a>
                                        <span class="btn btn-xs bg-${distanceId} race-distance-label">${item['race_distance']}</span>
                                    </h3>
                                    <div class="timeline-body">
                                        <div class="activity-data">
                                            <strong>Time: </strong>${item['elapsed_time_formatted']}
                                        </div>
                                        <div class="activity-data">
                                            <strong>Pace: </strong>${item['pace']}
                                            <small>${item['pace_unit']}</small>
                                        </div>
                                        <br />
                                        <div class="activity-data">
                                            <strong>Elevation: </strong>${item['elevation']}
                                            <small>${item['elevation_unit']}</small>
                                        </div>
                                        ${cadence}
                                        <br />
                                        <div class="activity-data">
                                            <strong>Gear: </strong>${item['gear_name']}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        `;
                    });
                },
            });
            return content;
        }
    }
}
