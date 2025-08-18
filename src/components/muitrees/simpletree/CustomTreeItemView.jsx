
'use client'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

import {
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemGroupTransition,
  TreeItemLabel,
  TreeItemRoot,
  TreeItemCheckbox,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import ParentCard from '@/components/shared/ParentCard';
import CustomTreeItemCode from '../code/simpletreecode/CustomTreeItemCode';
import { useTreeItem } from '@mui/x-tree-view';

const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));



const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, label, disabled, children, ...other } = props;


  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref, ...other });


  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <TreeItemCheckbox {...getCheckboxProps()} />
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Avatar
              sx={(theme) => ({
                background: theme.palette.primary.main,
                width: 24,
                height: 24,
                fontSize: '0.8rem',
              })}
            >
              {(label)[0]}
            </Avatar>
            <TreeItemLabel {...getLabelProps()} />
          </Box>
        </CustomTreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function CustomTreeItemView() {
  return (
    <ParentCard
      title="CustomTreeItem"
      codeModel={<CustomTreeItemCode />}
    >

      <Box sx={{ minHeight: 200, minWidth: 250 }}>
        <SimpleTreeView defaultExpandedItems={['3']}>
          <CustomTreeItem itemId="1" label="Amelia Hart">
            <CustomTreeItem itemId="2" label="Jane Fisher" />
          </CustomTreeItem>
          <CustomTreeItem itemId="3" label="Bailey Monroe">
            <CustomTreeItem itemId="4" label="Freddie Reed" />
            <CustomTreeItem itemId="5" label="Georgia Johnson">
              <CustomTreeItem itemId="6" label="Samantha Malone" />
            </CustomTreeItem>
          </CustomTreeItem>
        </SimpleTreeView>
      </Box>
    </ParentCard>
  );
}
