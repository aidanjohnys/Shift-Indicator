const UPSHIFT_RPM = 2800;
const DOWNSHIFT_RPM = 1500;
const MIN_SPEED_MS = 3;


angular.module('beamng.apps')
    .directive('shiftIndicator', function () {
        return {
            template:
                `
                <div id="container" style="width: 100%; height: 100%; overflow: hidden">
                    <div id="content" style="width: 160px; transform-origin: top left;" class="bngApp">
                        <svg height="135" width="160" style="display: block; {{svgStyle1}}">
                            <polygon points="78,5 150,130 5, 130" style="fill:lime;stroke:black;stroke-width:5"/>
                        </svg>
                        <h1 style="text-align: center">Shift</h1>
                        <svg height="135" width="160" style="display: block; {{svgStyle2}}">
                            <polygon points="78,130 150,5 5,5" style="fill:lime;stroke:black;stroke-width:5"/>
                        </svg>
                    </div>
                </div>`,
            restrict: 'EA',
            link: function (scope, element, attrs) {
                StreamsManager.add(['electrics', 'engineInfo']);
                scope.$on('streamsUpdate', function (event, streams) {
                    if (streams.engineInfo === null || streams.electrics == null) {
                        return;
                    }

                    const container = element[0];
                    const scale = container.parentElement.scrollWidth / 160;
                    const content = container.querySelector("#content");
                    content.style.transform = `scale(${scale})`;

                    const rpm = streams.electrics.rpm;
                    const wheelSpeed = streams.electrics.wheelspeed;
                    const gear = streams.electrics.gear;
                    const topGear = streams.engineInfo[6];
                    const clutch = streams.electrics.clutch;

                    if (clutch === 1) {
                        scope.svgStyle1 = 'opacity: 0.2; filter: grayscale(100%);';
                        scope.svgStyle2 = 'opacity: 0.2; filter: grayscale(100%);';
                        return;
                    }


                    if (gear === topGear) {
                        scope.svgStyle1 = 'opacity: 0.2; filter: grayscale(100%);';
                        scope.svgStyle2 = 'opacity: 0.2; filter: grayscale(100%);';
                        return;
                    }

                    if (rpm > UPSHIFT_RPM && gear >= 1 && wheelSpeed > MIN_SPEED_MS) {
                        scope.svgStyle1 = '';
                        scope.svgStyle2 = 'opacity: 0.2; filter: grayscale(100%);';
                    } else if (rpm < DOWNSHIFT_RPM && gear > 1) {
                        scope.svgStyle1 = 'opacity: 0.2; filter: grayscale(100%);';
                        scope.svgStyle2 = '';
                    } else {
                        scope.svgStyle1 = 'opacity: 0.2; filter: grayscale(100%);';
                        scope.svgStyle2 = 'opacity: 0.2; filter: grayscale(100%);';
                    }
                });

                scope.$on('$destroy', function () {
                    StreamsManager.remove(['electrics', 'engineInfo']);
                });
            }
        }
    });