// src/components/List.js
import React from 'react';
import ListItem from './ListItem';

const List = ({ items }) => {
    return (
        <div className="w-full">
            {items.map((item, index) => (
                <ListItem key={index} label={item.label} path={item.path} />
            ))}
        </div>
    );
};

export default List;
