import React, { useEffect } from 'react';
import { Admin, Resource } from 'react-admin';
import dataProvider from './modules/myRestProvider';
import authProvider from './modules/myAuthProvider';
import addUploadFeature from './modules/uploadFeature';
import CategoryList from './components/CategoryList';
import CategoryEdit from './components/CategoryEdit';
import CategoryCreate from './components/CategoryCreate';
import SubcategoryList from './components/SubcategoryList';
import CategoryShow from './components/CategoryShow';
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
			<Resource name="categories" list={CategoryList} show={CategoryShow} edit={CategoryEdit} create={CategoryCreate} />
			<Resource name="subcategories" list={SubcategoryList} />
		</Admin>
	);
}

export default App;
