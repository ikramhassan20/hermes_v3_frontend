import loginComponent from '../components/unAuthenticatedComponents/login';

import forgotPasswordComponent from '../components/unAuthenticatedComponents/forgotPassword';

import signUpComponent from '../components/unAuthenticatedComponents/signUp';

/****Lazy LOAD *****/
const lookUpListingComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/lookUp/lookUpListing')), '"segmentListing"');

const segmentListingComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/segment/segmentListing')), '"segmentListing"');

const campaignListingComponent = r => require.ensure(['../components/authenticatedComponents/dashboardChildComponents/campaign/campaignListing'], () => r(require('../components/authenticatedComponents/dashboardChildComponents/campaign/campaignListing')), '"campaignListing"');

const semanticBoardListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/semanticBoard/semanticBoardListing')), '"semanticBoardListing"');

const companyUserListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/company/companyUserListing')), ' "company"');

const companyBouncedUserListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/company/companyBouncedUserListing')), ' "company"');

const companyUnsubscribeUserListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/company/companyUnsubscribeUserListing')), ' "company"');

const newsFeedListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/newsfeed/newsFeedListing')), '"newsFeedListing"');

const galleryListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/gallery/galleryListing')), '"galleryListing"');

const semanticBoardCreateComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/semanticBoard/semanticBoardCreateComponent')), '"semanticBoardCreation"');

const campaignCreationComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/campaign/campaignCreation')), '"campaignCreation"');

const campaignStats = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/campaign/campaignStats')), '"campaignStats"');

const boardStats = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/semanticBoard/boardStats')), '"boardStats"');

const dashboardComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboard')), '"dashboard"');

const dashboardStatsComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/dashboardStats/dashboardStats')), '"dashboardStats"');

const newsfeedCreationComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/newsfeed/NewsFeedCreation')), '"newsFeedCreation"');

const newsFeedStats = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/newsfeed/newsFeedStats')), '"newsFeedStats"');

const attributeListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/attribute/attributeLisiting')), '"attributeLisiting"');

const segmentCreationComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/segment/segmentCreation')), '"segmentCreation"');

const importListingComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/import/importListing')), '"importListing"');

const userStats = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/company/companyUserStats')), '"companyUserStats"');

const boardListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/semanticBoard/boardListing')), '"boardListing"');

const locationListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/location/locationListing')), '"locationListing"');

const createLocation = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/location/createLocation')), '"createLocation"');

const appListingComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/app/appListing')), '"appListing"');

const queueListing = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/campaign/queueListing')), '"queueListing"');

const uploadComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/import/upload')), '"upload"');

const companyListingComponent = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/company/companyLisitng')), '"companyLisitng"');

const companyEdit = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/company/companyEdit')), '"companyEdit"');

const ServerTime = r => require.ensure([], () => r(require('../components/authenticatedComponents/dashboardChildComponents/company/ServerTime')), '"ServerTime"');


/****Lazy LOAD *****/

import notFoundComponent from '../components/otherComponents/notFound/notFound';
import languageLisiting from '../components/authenticatedComponents/dashboardChildComponents/language/languageLisiting';
import cacheViewer from "../components/authenticatedComponents/dashboardChildComponents/cache/cacheViewer";
import CampaignCappingSettings
    from "../components/authenticatedComponents/dashboardChildComponents/campaign/CampaignCappingSettings";
import packageListing from "../components/authenticatedComponents/dashboardChildComponents/package/package";
import responseTimeLogListing
    from "../components/authenticatedComponents/dashboardChildComponents/company/responseTimeLogListing";

//import semanticBoardCreateComponent from
//        '../components/authenticatedComponents/dashboardChildComponents/semanticBoard/semanticBoardCreateComponent';

export default [
    {
        path: "/",
        meta: {
            auth: false,
            route: "both"
        },
    },
    {
        path: "/login",
        component: loginComponent,
        meta: {
            auth: false,
            route: "both"
        },
    },
    {
        path: "/forgot-password",
        component: forgotPasswordComponent,
        meta: {
            auth: false,
            route: "both"
        },
    },
    {
        path: "/sign-up",
        component: signUpComponent,
        meta: {
            auth: false,
            route: "both"
        },
    },
    {
        path: "/dashboard",
        component: dashboardComponent,
        meta: {
            auth: true,
            route: "both"
        },
        children: [
            {
                path: "/dashboard/dashboard-stats",
                component: dashboardStatsComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/lookup-listing",
                component: lookUpListingComponent,
                meta: {
                    auth: true,
                    route: "both"
                },
            },
            {
                path: "/dashboard/app-listing",
                component: appListingComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/import-listing",
                component: importListingComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/attribute/import-attribute-data",
                component: uploadComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/attribute-listing",
                component: attributeListing,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/segment-listing",
                component: segmentListingComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/segment-create",
                component: segmentCreationComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/segment-edit/:id",
                component: segmentCreationComponent,
                beforeEnter: (to, from, next) => {
                    if (to.params.id) {
                        next();
                    } else {
                        next("/dashboard/segment-create");
                    }
                },
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/campaign/capping-settings",
                component: CampaignCappingSettings,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/campaign-listing",
                component: campaignListingComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/semantixBoard-listing",
                component: semanticBoardListing,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/semantixBoard-create",
                component: semanticBoardCreateComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/board-edit/:action/:id",
                component: semanticBoardCreateComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
                beforeEnter: (to, from, next) => {
                    if ((to.params.action == "edit" || to.params.action == "view") && to.params.id) {
                        next();
                    } else {
                        next("/dashboard/semantixBoard-listing");
                    }
                },
            },
            {
                path: "/dashboard/campaign-create",
                component: campaignCreationComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/campaign-edit/:action/:id",
                component: campaignCreationComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
                beforeEnter: (to, from, next) => {
                    if ((to.params.action == "edit" || to.params.action == "view") && to.params.id) {
                        next();
                    } else {
                        next("/dashboard/campaign-listing");
                    }
                },
            },
            {
                path: "/dashboard/campaign-stats/:id",
                component: campaignStats,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/language-listing",
                component: languageLisiting,
                meta: {
                    auth: true,
                    route: "admin"
                },
            },
            {
                path: "/dashboard/company-listing",
                component: companyListingComponent,
                meta: {
                    auth: true,
                    route: "admin"
                },
            },
            {
                path: "/dashboard/server-time",
                component: ServerTime,
                meta: {
                    auth: true,
                    route: "admin"
                },
            },
            {
                path: "/dashboard/company-edit/:id",
                component: companyEdit,
                meta: {
                    auth: true,
                    route: "both"
                },
            },
            {
                path: "/dashboard/company-userListing",
                component: companyUserListing,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/company-unsubscribe-userListing",
                component: companyUnsubscribeUserListing,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/bounced-users",
                component: companyBouncedUserListing,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/responseTime-log",
                component: responseTimeLogListing,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/newsFeed-Listing",
                component: newsFeedListing,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/location-Listing",
                component: locationListing,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/location-create",
                component: createLocation,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/edit-location/:id",
                component: createLocation,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/gallery-listing",
                component: galleryListing,
                meta: {
                    auth: true,
                    route: "both"
                },
            },
            {
                path: "/dashboard/user-stats/:id",
                component: userStats,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/newsfeed-stats/:id",
                component: newsFeedStats,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/newsfeed-create",
                component: newsfeedCreationComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/newsfeed-edit/:id",
                component: newsfeedCreationComponent,
                meta: {
                    auth: true,
                    route: "company"
                },
            },
            {
                path: "/dashboard/cache",
                component: cacheViewer,
                meta: {
                    auth: true,
                    route: "admin"
                },
            },
            {
                path: "/dashboard/campaign-queue-listing",
                component: queueListing,
                meta: {
                    auth: true,
                    route: "admin"
                }
            },
            {
                path: "/dashboard/board-queue-listing",
                component: boardListing,
                meta: {
                    auth: true,
                    route: "admin"
                }
            },
            {
                path: "/dashboard/package-listing",
                component: packageListing,
                meta: {
                    auth: true,
                    route: "admin"
                }
            },
            {
                path: "/dashboard/board-stats/:id",
                component: boardStats,
                meta: {
                    auth: true,
                    route: "company"
                },
            }
        ]
    },
    {
        path: '*',
        component: notFoundComponent,
    },
];







