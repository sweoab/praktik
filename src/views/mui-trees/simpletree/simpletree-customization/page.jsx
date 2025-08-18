
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';

import { Grid } from "@mui/material";
import BasicCustomIcons from "@/components/muitrees/simpletree/BasicCustomIcons";
import CustomTreeItemView from "@/components/muitrees/simpletree/CustomTreeItemView";
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Simple Treeview ",
    },
];

const SimpleTreeView = () => {
    return (
        <PageContainer title="Simple Treeview" description="this is Simple Treeview ">
            <Breadcrumb title="Simple Treeview" items={BCrumb} />
            <Grid container spacing={3}>

                <BasicCustomIcons />
                <CustomTreeItemView />

            </Grid>
        </PageContainer>
    );
};

export default SimpleTreeView;
