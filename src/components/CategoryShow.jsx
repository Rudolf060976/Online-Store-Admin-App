import React from 'react';
import { Show, SimpleShowLayout, TextField, ReferenceArrayField, SingleFieldList, ImageField } from 'react-admin';

const CategoryShow = props => (
	<Show {...props}>
		<SimpleShowLayout>
			<TextField source="id" />
			<TextField source="code" />
			<TextField source="name" />
			<TextField source="description" />
			<ReferenceArrayField label="Images" reference="images" source="images">
				<SingleFieldList>
					<ImageField source="url" />
				</SingleFieldList>
			</ReferenceArrayField>
		</SimpleShowLayout>
	</Show>
);

export default CategoryShow;
