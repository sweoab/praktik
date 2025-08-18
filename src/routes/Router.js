import React from 'react';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';

// Use the working Loadable component for all lazy loading
const lazyLoad = (importFunc) => Loadable(importFunc);

/* ***Layouts**** */
const FullLayout = lazyLoad(() => import('../layouts/full/FullLayout'));
const BlankLayout = lazyLoad(() => import('../layouts/blank/BlankLayout'));

/* ***Test Component**** */
const TestComponent = lazyLoad(() => import('../views/test/TestComponent'));
const AITestComponent = lazyLoad(() => import('../components/test/AITestComponent'));

/* ****Pages***** */
const ModernDash = lazyLoad(() => import('../views/dashboard/Modern'));
const EcommerceDash = lazyLoad(() => import('../views/dashboard/Ecommerce'));

/* ****Apps***** */
const Chats = lazyLoad(() => import('../views/apps/chat/Chat'));
const AIChat = lazyLoad(() => import('../views/apps/ai-chat/AIChat'));
const Notes = lazyLoad(() => import('../views/apps/notes/Notes'));
const Calendar = lazyLoad(() => import('../views/apps/calendar/BigCalendar'));
const Email = lazyLoad(() => import('../views/apps/email/Email'));
// const Blog = lazyLoad(() => import('../views/apps/blog/Blog'));
// const BlogDetail = lazyLoad(() => import('../views/apps/blog/BlogPost'));
const Tickets = lazyLoad(() => import('../views/apps/tickets/Tickets'));
const Contacts = lazyLoad(() => import('../views/apps/contacts/Contacts'));
const Ecommerce = lazyLoad(() => import('../views/apps/eCommerce/Ecommerce'));
const EcommerceDetail = lazyLoad(() => import('../views/apps/eCommerce/EcommerceDetail'));
const EcommerceAddProduct = lazyLoad(() => import('../views/apps/eCommerce/EcommerceAddProduct'));
const EcommerceEditProduct = lazyLoad(() => import('../views/apps/eCommerce/EcommerceEditProduct'));
const EcomProductList = lazyLoad(() => import('../views/apps/eCommerce/EcomProductList'));
const EcomProductCheckout = lazyLoad(() => import('../views/apps/eCommerce/EcommerceCheckout'));
const UserProfile = lazyLoad(() => import('../views/apps/user-profile/UserProfile'));
const Followers = lazyLoad(() => import('../views/apps/user-profile/Followers'));
const Friends = lazyLoad(() => import('../views/apps/user-profile/Friends'));
const Gallery = lazyLoad(() => import('../views/apps/user-profile/Gallery'));
const InvoiceList = lazyLoad(() => import('../views/apps/invoice/List'));
const InvoiceCreate = lazyLoad(() => import('../views/apps/invoice/Create'));
const InvoiceDetail = lazyLoad(() => import('../views/apps/invoice/Detail'));
const InvoiceEdit = lazyLoad(() => import('../views/apps/invoice/Edit'));
const Kanban = lazyLoad(() => import('../views/apps/kanban/Kanban'));
const CVGenerator = lazyLoad(() => import('../views/cv-generator/CVGenerator'));

// Communication - Kommunikation
const Communication = lazyLoad(() => import('../views/apps/communication/Communication'));

// Internships - Praktikplatser
const InternshipList = lazyLoad(() => import('../views/apps/internships/InternshipList'));
const InternshipDetails = lazyLoad(() => import('../views/apps/internships/InternshipDetails'));
const InternshipTestView = lazyLoad(() => import('../views/apps/internships/InternshipTestView'));
const InternshipApplication = lazyLoad(() => import('../views/apps/internships/InternshipApplication'));
const ApplicationDashboard = lazyLoad(() => import('../views/apps/internships/ApplicationDashboard'));

// Pages
const RollbaseCASL = lazyLoad(() => import('../views/pages/rollbaseCASL/RollbaseCASL'));
const Pricing = lazyLoad(() => import('../views/pages/pricing/Pricing'));
const AccountSetting = lazyLoad(() => import('../views/pages/account-setting/AccountSetting'));
const Faq = lazyLoad(() => import('../views/pages/faq/Faq'));

// widget
const WidgetCards = lazyLoad(() => import('../views/widgets/cards/WidgetCards'));
const WidgetBanners = lazyLoad(() => import('../views/widgets/banners/WidgetBanners'));
const WidgetCharts = lazyLoad(() => import('../views/widgets/charts/WidgetCharts'));

// form elements
const MuiAutoComplete = lazyLoad(() => import('../views/forms/form-elements/MuiAutoComplete'));
const MuiButton = lazyLoad(() => import('../views/forms/form-elements/MuiButton'));
const MuiCheckbox = lazyLoad(() => import('../views/forms/form-elements/MuiCheckbox'));
const MuiRadio = lazyLoad(() => import('../views/forms/form-elements/MuiRadio'));
const MuiSlider = lazyLoad(() => import('../views/forms/form-elements/MuiSlider'));
const MuiDateTime = lazyLoad(() => import('../views/forms/form-elements/MuiDateTime'));
const MuiSwitch = lazyLoad(() => import('../views/forms/form-elements/MuiSwitch'));

// form layout
const FormLayouts = lazyLoad(() => import('../views/forms/FormLayouts'));
const FormCustom = lazyLoad(() => import('../views/forms/FormCustom'));
const FormWizard = lazyLoad(() => import('../views/forms/FormWizard'));
const FormValidation = lazyLoad(() => import('../views/forms/FormValidation'));
const TiptapEditor = lazyLoad(() => import('../views/forms/from-tiptap/TiptapEditor'));
const FormHorizontal = lazyLoad(() => import('../views/forms/FormHorizontal'));
const FormVertical = lazyLoad(() => import('../views/forms/FormVertical'));

// tables
const BasicTable = lazyLoad(() => import('../views/tables/BasicTable'));
const CollapsibleTable = lazyLoad(() => import('../views/tables/CollapsibleTable'));
const EnhancedTable = lazyLoad(() => import('../views/tables/EnhancedTable'));
const FixedHeaderTable = lazyLoad(() => import('../views/tables/FixedHeaderTable'));
const PaginationTable = lazyLoad(() => import('../views/tables/PaginationTable'));
const SearchTable = lazyLoad(() => import('../views/tables/SearchTable'));

//react tables
const ReactBasicTable = lazyLoad(() => import('../views/react-tables/basic/page'));
const ReactColumnVisibilityTable = lazyLoad(() => import('../views/react-tables/columnvisibility/page'));
const ReactDragDropTable = lazyLoad(() => import('../views/react-tables/drag-drop/page'));
const ReactDenseTable = lazyLoad(() => import('../views/react-tables/dense/page'));
const ReactEditableTable = lazyLoad(() => import('../views/react-tables/editable/page'));
const ReactEmptyTable = lazyLoad(() => import('../views/react-tables/empty/page'));
const ReactExpandableTable = lazyLoad(() => import('../views/react-tables/expanding/page'));
const ReactFilterTable = lazyLoad(() => import('../views/react-tables/filtering/page'));
const ReactPaginationTable = lazyLoad(() => import('../views/react-tables/pagination/page'));
const ReactRowSelectionTable = lazyLoad(() => import('../views/react-tables/row-selection/page'));
const ReactSortingTable = lazyLoad(() => import('../views/react-tables/sorting/page'));
const ReactStickyTable = lazyLoad(() => import('../views/react-tables/sticky/page'));

// chart
const LineChart = lazyLoad(() => import('../views/charts/LineChart'));
const GredientChart = lazyLoad(() => import('../views/charts/GredientChart'));
const DoughnutChart = lazyLoad(() => import('../views/charts/DoughnutChart'));
const AreaChart = lazyLoad(() => import('../views/charts/AreaChart'));
const ColumnChart = lazyLoad(() => import('../views/charts/ColumnChart'));
const CandlestickChart = lazyLoad(() => import('../views/charts/CandlestickChart'));
const RadialbarChart = lazyLoad(() => import('../views/charts/RadialbarChart'));

// ui
const MuiAlert = lazyLoad(() => import('../views/ui-components/MuiAlert'));
const MuiAccordion = lazyLoad(() => import('../views/ui-components/MuiAccordion'));
const MuiAvatar = lazyLoad(() => import('../views/ui-components/MuiAvatar'));
const MuiChip = lazyLoad(() => import('../views/ui-components/MuiChip'));
const MuiDialog = lazyLoad(() => import('../views/ui-components/MuiDialog'));
const MuiList = lazyLoad(() => import('../views/ui-components/MuiList'));
const MuiPopover = lazyLoad(() => import('../views/ui-components/MuiPopover'));
const MuiRating = lazyLoad(() => import('../views/ui-components/MuiRating'));
const MuiTabs = lazyLoad(() => import('../views/ui-components/MuiTabs'));
const MuiTooltip = lazyLoad(() => import('../views/ui-components/MuiTooltip'));
const MuiTransferList = lazyLoad(() => import('../views/ui-components/MuiTransferList'));
const MuiTypography = lazyLoad(() => import('../views/ui-components/MuiTypography'));

// authentication
const Login = lazyLoad(() => import('../views/authentication/auth1/Login'));
const Login2 = lazyLoad(() => import('../views/authentication/auth2/Login2'));
const Register = lazyLoad(() => import('../views/authentication/auth1/Register'));
const Register2 = lazyLoad(() => import('../views/authentication/auth2/Register2'));
const ForgotPassword = lazyLoad(() => import('../views/authentication/auth1/ForgotPassword'));
const ForgotPassword2 = lazyLoad(() => import('../views/authentication/auth2/ForgotPassword2'));
const TwoSteps = lazyLoad(() => import('../views/authentication/auth1/TwoSteps'));
const TwoSteps2 = lazyLoad(() => import('../views/authentication/auth2/TwoSteps2'));
const Error = lazyLoad(() => import('../views/authentication/Error'));
const Maintenance = lazyLoad(() => import('../views/authentication/Maintenance'));

// landingpage
const Landingpage = lazyLoad(() => import('../views/pages/landingpage/Landingpage'));

// front end pages - using standard lazy loading
const Homepage = lazyLoad(() => import('../views/pages/frontend-pages/Homepage'));
const About = lazyLoad(() => import('../views/pages/frontend-pages/About'));
const Contact = lazyLoad(() => import('../views/pages/frontend-pages/Contact'));
const Portfolio = lazyLoad(() => import('../views/pages/frontend-pages/Portfolio'));
const PagePricing = lazyLoad(() => import('../views/pages/frontend-pages/Pricing'));
const BlogPage = lazyLoad(() => import('../views/pages/frontend-pages/Blog'));
const BlogPost = lazyLoad(() => import('../views/pages/frontend-pages/BlogPost'));

//mui charts
const BarCharts = lazyLoad(() => import('../views/muicharts/barcharts/page'));
const GaugeCharts = lazyLoad(() => import('../views/muicharts/gaugecharts/page'));
const AreaCharts = lazyLoad(() => import('../views/muicharts/linecharts/area/page'));
const LineCharts = lazyLoad(() => import('../views/muicharts/linecharts/line/page'));
const PieCharts = lazyLoad(() => import('../views/muicharts/piecharts/page'));
const ScatterCharts = lazyLoad(() => import('../views/muicharts/scattercharts/page'));
const SparklineCharts = lazyLoad(() => import('../views/muicharts/sparklinecharts/page'));

//mui tree
const SimpletreeCustomization = lazyLoad(() => import('../views/mui-trees/simpletree/simpletree-customization/page'));
const SimpletreeExpansion = lazyLoad(() => import('../views/mui-trees/simpletree/simpletree-expansion/page'));
const SimpletreeFocus = lazyLoad(() => import('../views/mui-trees/simpletree/simpletree-focus/page'));
const SimpletreeItems = lazyLoad(() => import('../views/mui-trees/simpletree/simpletree-items/page'));
const SimpletreeSelection = lazyLoad(() => import('../views/mui-trees/simpletree/simpletree-selection/page'));

const Router = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboards/modern" /> },
      { path: '/dashboards/modern', exact: true, element: <ModernDash /> },
      { path: '/dashboards/ecommerce', exact: true, element: <EcommerceDash /> },
      { path: '/apps/chats', element: <Chats /> },
      { path: '/apps/communication', element: <Communication /> },
      { path: '/apps/ai-chat', element: <AIChat /> },
      { path: '/apps/notes', element: <Notes /> },
      { path: '/apps/calendar', element: <Calendar /> },
      { path: '/apps/email', element: <Email /> },
      { path: '/apps/tickets', element: <Tickets /> },
      { path: '/apps/contacts', element: <Contacts /> },
      { path: '/apps/ecommerce/shop', element: <Ecommerce /> },
      { path: '/apps/ecommerce/eco-product-list', element: <EcomProductList /> },
      { path: '/apps/ecommerce/eco-checkout', element: <EcomProductCheckout /> },
      { path: '/apps/ecommerce/add-product', element: <EcommerceAddProduct /> },
      { path: '/apps/ecommerce/edit-product', element: <EcommerceEditProduct /> },
      { path: '/apps/ecommerce/detail/:id', element: <EcommerceDetail /> },
      { path: '/apps/kanban', element: <Kanban /> },
      { path: '/apps/cv-generator', element: <CVGenerator /> },
      { path: '/apps/internships', element: <InternshipList /> },
      { path: '/apps/internships/:id', element: <InternshipDetails /> },
      { path: '/apps/internships/:id/apply', element: <InternshipApplication /> },
      { path: '/apps/internships/dashboard', element: <ApplicationDashboard /> },
      { path: '/apps/internships-test', element: <InternshipTestView /> },
      { path: '/apps/invoice/list', element: <InvoiceList /> },
      { path: '/apps/invoice/create', element: <InvoiceCreate /> },
      { path: '/apps/invoice/detail/:id', element: <InvoiceDetail /> },
      { path: '/apps/invoice/edit/:id', element: <InvoiceEdit /> },
      { path: '/apps/followers', element: <Followers /> },
      { path: '/apps/friends', element: <Friends /> },
      { path: '/apps/gallery', element: <Gallery /> },
      { path: '/user-profile', element: <UserProfile /> },
      { path: '/pages/casl', element: <RollbaseCASL /> },

      { path: '/pages/pricing', element: <Pricing /> },
      { path: '/pages/account-settings', element: <AccountSetting /> },
      { path: '/pages/faq', element: <Faq /> },
      { path: '/forms/form-elements/autocomplete', element: <MuiAutoComplete /> },
      { path: '/forms/form-elements/button', element: <MuiButton /> },
      { path: '/forms/form-elements/checkbox', element: <MuiCheckbox /> },
      { path: '/forms/form-elements/radio', element: <MuiRadio /> },
      { path: '/forms/form-elements/slider', element: <MuiSlider /> },
      { path: '/forms/form-elements/date-time', element: <MuiDateTime /> },
      { path: '/forms/form-elements/date-range', element: <MuiDateTime /> },
      { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      { path: '/forms/form-tiptap', element: <TiptapEditor /> },
      { path: '/forms/form-layouts', element: <FormLayouts /> },
      { path: '/forms/form-horizontal', element: <FormHorizontal /> },
      { path: '/forms/form-vertical', element: <FormVertical /> },
      { path: '/forms/form-custom', element: <FormCustom /> },
      { path: '/forms/form-wizard', element: <FormWizard /> },
      { path: '/forms/form-validation', element: <FormValidation /> },
      { path: '/tables/basic', element: <BasicTable /> },
      { path: '/tables/collapsible', element: <CollapsibleTable /> },
      { path: '/tables/enhanced', element: <EnhancedTable /> },
      { path: '/tables/fixed-header', element: <FixedHeaderTable /> },
      { path: '/tables/pagination', element: <PaginationTable /> },
      { path: '/tables/search', element: <SearchTable /> },
      { path: '/charts/line-chart', element: <LineChart /> },
      { path: '/charts/gredient-chart', element: <GredientChart /> },
      { path: '/charts/doughnut-pie-chart', element: <DoughnutChart /> },
      { path: '/charts/area-chart', element: <AreaChart /> },
      { path: '/charts/column-chart', element: <ColumnChart /> },
      { path: '/charts/candlestick-chart', element: <CandlestickChart /> },
      { path: '/charts/radialbar-chart', element: <RadialbarChart /> },
      { path: '/ui-components/alert', element: <MuiAlert /> },
      { path: '/ui-components/accordion', element: <MuiAccordion /> },
      { path: '/ui-components/avatar', element: <MuiAvatar /> },
      { path: '/ui-components/chip', element: <MuiChip /> },
      { path: '/ui-components/dialog', element: <MuiDialog /> },
      { path: '/ui-components/list', element: <MuiList /> },
      { path: '/ui-components/popover', element: <MuiPopover /> },
      { path: '/ui-components/rating', element: <MuiRating /> },
      { path: '/ui-components/tabs', element: <MuiTabs /> },
      { path: '/ui-components/tooltip', element: <MuiTooltip /> },
      { path: '/ui-components/transfer-list', element: <MuiTransferList /> },
      { path: '/ui-components/typography', element: <MuiTypography /> },
      { path: '/widgets/cards', element: <WidgetCards /> },
      { path: '/widgets/banners', element: <WidgetBanners /> },
      { path: '/widgets/charts', element: <WidgetCharts /> },
      { path: '/react-tables/basic', element: <ReactBasicTable /> },
      { path: '/react-tables/column-visiblity', element: <ReactColumnVisibilityTable /> },
      { path: '/react-tables/drag-drop', element: <ReactDragDropTable /> },
      { path: '/react-tables/dense', element: <ReactDenseTable /> },
      { path: '/react-tables/editable', element: <ReactEditableTable /> },
      { path: '/react-tables/empty', element: <ReactEmptyTable /> },
      { path: '/react-tables/expanding', element: <ReactExpandableTable /> },
      { path: '/react-tables/filter', element: <ReactFilterTable /> },
      { path: '/react-tables/pagination', element: <ReactPaginationTable /> },
      { path: '/react-tables/row-selection', element: <ReactRowSelectionTable /> },
      { path: '/react-tables/sorting', element: <ReactSortingTable /> },
      { path: '/react-tables/sticky', element: <ReactStickyTable /> },


      { path: '/muicharts/barcharts', element: <BarCharts /> },
      { path: '/muicharts/gaugecharts', element: <GaugeCharts /> },
      { path: '/muicharts/linecharts/area', element: <AreaCharts /> },
      { path: '/muicharts/linecharts/line', element: <LineCharts /> },
      { path: '/muicharts/piecharts', element: <PieCharts /> },
      { path: '/muicharts/scattercharts', element: <ScatterCharts /> },
      { path: '/muicharts/sparklinecharts', element: <SparklineCharts /> },

      { path: '/mui-trees/simpletree/simpletree-customization', element: <SimpletreeCustomization /> },
      { path: '/mui-trees/simpletree/simpletree-expansion', element: <SimpletreeExpansion /> },
      { path: '/mui-trees/simpletree/simpletree-focus', element: <SimpletreeFocus /> },
      { path: '/mui-trees/simpletree/simpletree-items', element: <SimpletreeItems /> },
      { path: '/mui-trees/simpletree/simpletree-selection', element: <SimpletreeSelection /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/forgot-password2', element: <ForgotPassword2 /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '/auth/two-steps2', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      { path: '/landingpage', element: <Landingpage /> },
      { path: '/frontend-pages/homepage', element: <Homepage /> },
      { path: '/frontend-pages/about', element: <About /> },
      { path: '/frontend-pages/contact', element: <Contact /> },
      { path: '/frontend-pages/portfolio', element: <Portfolio /> },
      { path: '/frontend-pages/pricing', element: <PagePricing /> },
      { path: '/frontend-pages/blog', element: <BlogPage /> },
      { path: '/frontend-pages/blog/detail/:id', element: <BlogPost /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;
