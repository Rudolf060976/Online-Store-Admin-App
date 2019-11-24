import React, { useEffect } from 'react';
import { Admin, Resource } from 'react-admin';
import dataProvider from './modules/myRestProvider';
import authProvider from './modules/myAuthProvider';
import addUploadFeature from './modules/uploadFeature';
import CategoryList from './components/CategoryList';
import CategoryShow from './components/CategoryShow';
import CategoryEdit from './components/CategoryEdit';
import CategoryCreate from './components/CategoryCreate';
import SubcategoryList from './components/SubcategoryList';
import SubcategoryShow from './components/SubcategoryShow';
import SubcategoryEdit from './components/SubcategoryEdit';
import SubcategoryCreate from './components/SubcategoryCreate';
import ItemsList from './components/ItemsList';
import ItemCreate from './components/ItemCreate';
import ItemEdit from './components/ItemEdit';
import ItemShow from './components/ItemShow';
import ItemSpecialsList from './components/ItemSpecialsList';
import ItemSpecialsEdit from './components/ItemSpecialsEdit';

import Home from './pages/Home/Home';


const ModifiedDataProvider = addUploadFeature(dataProvider);

function App() {

	const unasolavez = 1;

	useEffect(() => {
		localStorage.removeItem('idbitzone');
		localStorage.removeItem('username');
		localStorage.removeItem('firstname');
		localStorage.removeItem('lastname'); 
	}, [unasolavez]);


	return (
		<Admin dashboard={Home} dataProvider={ModifiedDataProvider} authProvider={authProvider}>
			<Resource name="images" />
			<Resource name="departments" list={CategoryList} show={CategoryShow} edit={CategoryEdit} create={CategoryCreate} />
			<Resource name="subdepartments" list={SubcategoryList} show={SubcategoryShow} edit={SubcategoryEdit} create={SubcategoryCreate} />
			<Resource name="items" list={ItemsList} create={ItemCreate} edit={ItemEdit} show={ItemShow} />
			<Resource name="item_specials" list={ItemSpecialsList} edit={ItemSpecialsEdit} />
		</Admin>
	);
}

export default App;
