
const apiURL = 'http://localhost:3000/api/';
let url = '';
let options = {};
let query = {};
let qs = '';

/* LA IDEA DE ESTA FUNCIÓN ES PONERLA POR ENCIMA DE myRestProvider Y ME PERMITE HACER MÚLTIPLES PETICIONES AL SERVIDOR Y 
REALIZAR OPERACIONES VARIADAS ANTES DE EJECUTAR (O SUSTITUYENDO) AL REST PROVIDER, YO DECIDO SI HAGO TODO AQUÍ O EJECUTO AL FINAL EL REST PROVIDER  */

const addUploadFeature = requestHandler => {

	return (type, resource, params) => {

		if (type === 'GET_ONE' && resource === 'departments') { // SOLO PARA OPERACIONES GET_ONE CON categories

			/* LA IDEA ES: CUANDO SE HAGA CLICK EN EL BOTÓN EDITAR CATEGORIA, react-admin HACE UN GET_ONE PARA PEDIR
			EL DOCUMENTO AL SERVIDOR (RECORD), PERO EN EL DOCUMENTO VIENE LA PROPIEDAD images QUE ES SOLO UN ARRAY DE ids
			ENTONCES QUEREMOS SOLICITAR TODAS ESAS IMÁGENES AL SERVIDOR PARA PONERLAS DISPONIBLES EN EL OBJETO CATEGORÍA
			Y QUE PUEDAN VERSE LAS IMÁGENES EN EL ADMIN   */

			// PRIMERO DEBEMOS BUSCAR EL categoryObj..

			let categoryObj = {};

			const { id } = params;

			url = `${apiURL}categories/${id}`;

			options = {
				method: 'GET',
				credentials: 'include',
				mode: 'cors'									
			};

			return fetch(url, options).then(res => {

				return res.json();

			}).then(res => {

				categoryObj = res.data.category; // YA TENEMOS EL categoryObj, AHORA VAMOS A SOLICITAR LAS IMÁGENES AL SERVIDOR.

				const imagesIdArray = res.data.category.images; // ESTO ES EL ARRAY CON LOS ID DE LAS IMÁGENES
			
				options = {
					method: 'GET',
					credentials: 'include',
					mode: 'cors'					
				};

				query = {
					filter: JSON.stringify({ ids: imagesIdArray })
				};

				qs = new URLSearchParams(query).toString();

				url = `${apiURL}categories/images/many?${qs}`;

				return fetch(url, options).then(response => response.json()); // SOLICITAMOS LAS IMÁGENES AL SERVIDOR
								

			}).then(res => {

				const imagesArray = res.data; // VIENEN LAS IMÁGENES COMO UN ARRAY [{ _id: xxx, image: _Buffer_ }]

				let outputArray = [];

				if (imagesArray) {

					outputArray = imagesArray.map(item => { // LO CONVERTIMOR A UN ARRAY ASI [{id: xxxx, url: xxxx},...]

						return {
							id: item._id,
							url: URL.createObjectURL(new Blob([Buffer.from(item.image)]))
						};
	
					});

				}				

				// AHORA AÑADIMOS ESTE ARRAY CON LAS IMÁGENES AL OBJETO categoryObject

				categoryObj = {
					...categoryObj,
					pictures: outputArray
				};

				// RECUERDEN QUE LA FUNCIÓN DEBE DEVOLVER UNA PROMESA CON LA DATA EN EL FORMATO QUE ACEPTA REACT ADMIN
				/* QUÉ ESTAMOS HACIENDO??? DARLE A REACT ADMIN UN OBJETO data QUE TIENE TODA LA DATA DE LA CATEGORÍA,
				CON UNA PROPIEDAD ADICIONAL pictures LA CUAL CONTIENE UN ARRAY DE LA FORMA [{id: xxx, url: xxx }] EL CUAL
				ME PERMITE VISUALIZAR TODAS LAS IMÁGENES EXISTENTES EN EL MODO DE EDICIÓN, Y PODERLAS ELIMINAR SI QUIERO */

				return Promise.resolve({ 
					data: {
						id: categoryObj._id,
						...categoryObj
					}
				});

			});


		}

		if (type === 'UPDATE' && resource === 'departments') { // *******OPERACIONES UPDATE  con categories

			/* ESTO SE EJECUTA JUSTO AL PRESIONAR EL BOTÓN SAVE EN EL MODO DE EDICIÓN, LA IDEA ES BUSCAR LAS IMÁGENES
			QUE FUERON AGREGADAS. RECUERDEN QUE EN GET_ONE (ARRIBA) NOSOTROS CREAMOS UNA PROPIEDAD pictures QUE ES UN ARRAY
			DE OBJECTOS [{id: xxx, url: xxx }] CON EL FIN DE PODER VER TODAS LAS IMÁGENES EN MODO EDICIÓN. ENTONCES, EL COMPONENTE ImageInput QUE ESTÁ EN TODOS LOS EDIT Y CREATE, CUANDO
			SE AGREGAN ARCHIVOS DE IMAGEN NUEVOS, AÑADE UNA PROPIEDAD rawFile A CADA OBJETO DEL ARRAY ANTERIOR, OSEA
			QUE pictures AHORA SERÁ [{id: xxx, url: xxx, rawFile: _File_ }]. rawFile SERÁ UN File CUANDO SEA UN ARCHIVO NUEVO,
			Y SERÁ Undefined CUANDO SE TRATE DE UN ARCHIVO EXISTENTE. ENTONCES LO QUE HACEMOS ES IDENTIFICAR ESOS ARCHIVOS
			NUEVOS PARA ALMACENARLOS EN EL SERVIDOR, ASOCIADOS CON EL categoryId  */

			// notice that following condition can be true only when `<ImageInput source="pictures" />` component has parameter `multiple={true}`
			// if parameter `multiple` is false, then data.pictures is not an array, but single object
			
			if (params.data.pictures && params.data.pictures.length > 0) {
				// only freshly dropped pictures are instance of File
				
				const { id: categoryId } = params.data; // ID DE LA CATEGORÍA
				
				const formerPictures = params.data.pictures.filter(p => !(p.rawFile instanceof File));

            	const newPictures = params.data.pictures.filter(p => p.rawFile instanceof File);
				
				/* PRIMERO QUE NADA HAY QUE IDENTIFICAR LAS IMÁGENES YA EXISTENTES QUE FUERON ELIMINADAS, PARA ELLO
				HAY QUE HACER UN FETCH AL SERVIDOR PARA DETERMINAR EL ARRAY DE ID DE IMÁGENES INICIAL, Y COMPARARLO CON
				EL ARRAY ACTUAL */

				options = {
					method: 'GET',
					credentials: 'include',
					mode: 'cors'					
				};

				url = `${apiURL}categories/${categoryId}`;
				
				return fetch(url, options).then(res => res.json()).then(res => {


					const initialIdArray = res.data.category.images;

					const imagesIdArray = formerPictures.map(item => {

						return item.id;
	
					});

					// NECESITAMOS SABER LOS ID DE IMAGENES ELIMINADAS

					const deletedIdArray = initialIdArray.filter(item => {

						return !imagesIdArray.includes(item);

					});

					
					if (deletedIdArray.length > 0) {

						// AHORA ESTOS ID IMAGES HAY QUE MANDARLOS A ELIMINAR AL SERVIDOR

						options = {
							method: 'DELETE',
							credentials: 'include',
							mode: 'cors'					
						};
	
						query = {
	
							filter: JSON.stringify({
								ids: deletedIdArray
							})
	
						};
	
						qs = new URLSearchParams(query).toString();
	
	
						url = `${apiURL}categories/${categoryId}/images/many?${qs}`;
	
						return fetch(url, options).then(resp => resp.json());	


					}

					return Promise.resolve();

				}).then(() => {

					// UNA VEZ QUE YA ESTÁN ELIMINADAS LAS IMÁGENES, AHORA NOS TOCA ACTUALIZAR LOS DATOS MODIFICADOS EN EL SERVIDOR

					const { code, name, description } = params.data;

					const data = {

						filter: {
							code,
							name,
							description
						}
					};

					options = {
						method: 'PUT',
						credentials: 'include',
						mode: 'cors',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)					
					};
										
					url = `${apiURL}categories/${categoryId}`;
					
					return fetch(url, options).then(resp => resp.json());
			
				})
					.then(json => {
							
						if (newPictures.length > 0) {

							// AHORA VAMOS A CREAR UN FORM DATA PARA ENVIAR TODAS LAS IMÁGENES NUEVAS AL SERVIDOR
							const formData = new FormData();
						
							for (let i = 0; i < newPictures.length; i++) {
								formData.append('images', newPictures[i].rawFile); // SOLO ENVIAMOS EL rawFile
							}
	
							options = {
								method: 'POST',
								credentials: 'include',
								mode: 'cors',
								body: formData					
							};
		
							url = `${apiURL}categories/${categoryId}/images/all`;
							
							return fetch(url, options).then(res => res.json());
		

						}

						return Promise.resolve(json);					
				
					})
					.then(json => {

						const categoryObj = json.data.category;
						
						return Promise.resolve({
							data: {
								id: categoryObj._id,
								...categoryObj
							}

						});

					});


			}


			// ESTO SE EJECUTA EN CASO DE QUE EL ITEM NO TENGA IMÁGENES, OSEA QUE EL CÓDIGO DE ARRIBA NO SE EJECUTA

			const { id: categoryId } = params.data; // ID DE LA CATEGORÍA

			const imagesIdArray = params.data.images;

			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};

			query = {

				filter: JSON.stringify({
					ids: imagesIdArray
				})

			};

			qs = new URLSearchParams(query).toString();


			url = `${apiURL}categories/${categoryId}/images/many?${qs}`;

			return fetch(url, options).then(resp => resp.json()).then(res => {

				const data = {

					filter: {
						...params.data,
						images: []
					}
					
				};

				options = {
					method: 'PUT',
					credentials: 'include',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)					
				};


				url = `${apiURL}categories/${categoryId}`;


				return fetch(url, options).then(resp => resp.json());


			}).then(json => {

				const categoryObj = json.data.category;

				return Promise.resolve({
					data: {
						id: categoryObj._id,
						...categoryObj
					}
				});

			});


		}
				
		if (type === 'DELETE' && resource === 'departments') { // ******* OPERACIONES DELETE con categories 

			// PRIMERO QUE NADA HAY QUE ELIMINAR EN EL SERVIDOR TODAS LAS IMÁGENES DE LA CATEGORÍA

			const { id: categoryId } = params;
			
			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};
			
			url = `${apiURL}categories/${categoryId}`;

			return fetch(url, options).then(res => res.json()).then(json => {

				return Promise.resolve({
					data: {
						id: json.data.category._id,
						...json.data.category
					}
				});

			});

		}

		if (type === 'DELETE_MANY' && resource === 'departments') { // ******* OPERACIONES DELETE_MANY con categories

			const { ids } = params;
			
			/* PRIMERO QUE NADA, USANDO LOS IDS, MANDAMOS A ELIMINAR TODAS LAS IMÁGES DE LAS CATEGORÍAS */

			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};

			query = {
				filter: JSON.stringify({ ids: params.ids })
			};

			qs = new URLSearchParams(query).toString();
			
			url = `${apiURL}categories/many?${qs}`;

			
			return fetch(url, options).then(() => {

				return Promise.resolve({
					data: ids
				});

			});	


		}

		if (type === 'CREATE' && resource === 'departments') { // ****** OPERACIONES CREATE con categories

			/* ESTO SE EJECUTA JUSTO AL PRESIONAR EL BOTÓN SAVE EN EL MODO DE EDICIÓN, LA IDEA ES BUSCAR LAS IMÁGENES
			QUE FUERON AGREGADAS. RECUERDEN QUE EN GET_ONE (ARRIBA) NOSOTROS CREAMOS UNA PROPIEDAD pictures QUE ES UN ARRAY
			DE OBJECTOS [{id: xxx, url: xxx }] CON EL FIN DE PODER VER TODAS LAS IMÁGENES EN MODO EDICIÓN. ENTONCES, EL COMPONENTE ImageInput QUE ESTÁ EN TODOS LOS EDIT Y CREATE, CUANDO	SE AGREGAN ARCHIVOS DE IMAGEN NUEVOS, AÑADE UNA PROPIEDAD rawFile A CADA OBJETO DEL ARRAY ANTERIOR, OSEA QUE pictures AHORA SERÁ [{id: xxx, url: xxx, rawFile: _File_ }]. rawFile SERÁ UN File CUANDO SEA UN ARCHIVO NUEVO, Y SERÁ Undefined CUANDO SE TRATE DE UN ARCHIVO EXISTENTE (EN ESTE CASO COMO ESTAMOS CREANDO UN REGISTRO, SOLO HABRÁN ARCHIVOS NUEVOS). ENTONCES LO QUE HACEMOS ES IDENTIFICAR ESOS ARCHIVOS NUEVOS PARA ALMACENARLOS EN EL SERVIDOR, ASOCIADOS CON EL categoryId  */

			// notice that following condition can be true only when `<ImageInput source="pictures" />` component has parameter `multiple={true}`
			// if parameter `multiple` is false, then data.pictures is not an array, but single object

			if (params.data.pictures && params.data.pictures.length) {

				// only freshly dropped pictures are instance of File
				
				const newPictures = params.data.pictures.filter(p => p.rawFile instanceof File);

				// ACTUALIZAMOS PRIMERO LOS DATOS DE LA NUEVA CATEGORÍA

				const { code, name, description } = params.data;

				const data = {

					filter: {
						code,
						name,
						description
					}
				};

				options = {
					method: 'POST',
					credentials: 'include',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)					
				};
									
				url = `${apiURL}categories/`;

				return fetch(url, options).then(res => res.json()).then(json => {

					const { category: categoryObj } = json.data;

					const { _id: categoryId } = categoryObj;

					// AHORA VAMOS A CREAR UN FORM DATA PARA ENVIAR TODAS LAS IMÁGENES NUEVAS AL SERVIDOR
					const formData = new FormData();
						
					for (let i = 0; i < newPictures.length; i++) {
						formData.append('images', newPictures[i].rawFile); // SOLO ENVIAMOS EL rawFile
					}

					options = {
						method: 'POST',
						credentials: 'include',
						mode: 'cors',
						body: formData					
					};

					url = `${apiURL}categories/${categoryId}/images/all`;
						
					return fetch(url, options).then(res => res.json());

				}).then(json => {

					const categoryObj = json.data.category;
						
					return Promise.resolve({
						data: {
							id: categoryObj._id,
							...categoryObj
						}

					});


				});



			}

			// SI NO HAY IMÁGENES, SOLO ACTUALIZAMOS LOS DATOS

			const { code, name, description } = params.data;
				
			const data = {

				filter: {
					code,
					name,
					description
				}
			};

			options = {
				method: 'POST',
				credentials: 'include',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)					
			};
							
			url = `${apiURL}categories`;


			return fetch(url, options).then(res => res.json()).then(json => {
				
				const categoryObj = json.data.category;
				
				return Promise.resolve({
					data: {
						id: categoryObj._id,
						...categoryObj
					}

				});


			});

		}

		if (type === 'GET_ONE' && resource === 'subdepartments') {

			let subcategoryObj = {};

			const { id } = params;

			url = `${apiURL}categories/sub/${id}`;

			options = {
				method: 'GET',
				credentials: 'include',
				mode: 'cors'									
			};

			return fetch(url, options).then(res => res.json()).then(res => {
				
				subcategoryObj = res.data.subcategory; // YA TENEMOS EL categoryObj, AHORA VAMOS A SOLICITAR LAS IMÁGENES AL SERVIDOR.

				const imagesIdArray = res.data.subcategory.images; // ESTO ES EL ARRAY CON LOS ID DE LAS IMÁGENES
			
				options = {
					method: 'GET',
					credentials: 'include',
					mode: 'cors'					
				};

				query = {
					filter: JSON.stringify({ ids: imagesIdArray })
				};

				qs = new URLSearchParams(query).toString();
				
				url = `${apiURL}categories/images/many?${qs}`;

				return fetch(url, options).then(response => response.json()); // SOLICITAMOS LAS IMÁGENES AL SERVIDOR
			
			}).then(res => {

				const imagesArray = res.data; // VIENEN LAS IMÁGENES COMO UN ARRAY [{ _id: xxx, image: _Buffer_ }]

				let outputArray = [];

				if (imagesArray) {

					outputArray = imagesArray.map(item => { // LO CONVERTIMOR A UN ARRAY ASI [{id: xxxx, url: xxxx},...]

						return {
							id: item._id,
							url: URL.createObjectURL(new Blob([Buffer.from(item.image)]))
						};
	
					});

				}
				
				// AHORA AÑADIMOS ESTE ARRAY CON LAS IMÁGENES AL OBJETO categoryObject

				subcategoryObj = {
					...subcategoryObj,
					pictures: outputArray
				};

				// RECUERDEN QUE LA FUNCIÓN DEBE DEVOLVER UNA PROMESA CON LA DATA EN EL FORMATO QUE ACEPTA REACT ADMIN
				/* QUÉ ESTAMOS HACIENDO??? DARLE A REACT ADMIN UN OBJETO data QUE TIENE TODA LA DATA DE LA CATEGORÍA,
				CON UNA PROPIEDAD ADICIONAL pictures LA CUAL CONTIENE UN ARRAY DE LA FORMA [{id: xxx, url: xxx }] EL CUAL
				ME PERMITE VISUALIZAR TODAS LAS IMÁGENES EXISTENTES EN EL MODO DE EDICIÓN, Y PODERLAS ELIMINAR SI QUIERO */

				return Promise.resolve({ 
					data: {
						id: subcategoryObj._id,
						...subcategoryObj
					}
				});


			});

		}
		
		if (type === 'UPDATE' && resource === 'subdepartments') {

			if (params.data.pictures && params.data.pictures.length > 0) {

				const { id: subcategoryId } = params.data; // ID DE LA SUBCATEGORÍA
				
				const formerPictures = params.data.pictures.filter(p => !(p.rawFile instanceof File));

            	const newPictures = params.data.pictures.filter(p => p.rawFile instanceof File);

				/* PRIMERO QUE NADA HAY QUE IDENTIFICAR LAS IMÁGENES YA EXISTENTES QUE FUERON ELIMINADAS, PARA ELLO
				HAY QUE HACER UN FETCH AL SERVIDOR PARA DETERMINAR EL ARRAY DE ID DE IMÁGENES INICIAL, Y COMPARARLO CON
				EL ARRAY ACTUAL */

				options = {
					method: 'GET',
					credentials: 'include',
					mode: 'cors'					
				};

				url = `${apiURL}categories/sub/${subcategoryId}`;


				return fetch(url, options).then(res => res.json()).then(res => {

				
					const initialIdArray = res.data.subcategory.images;
					
					const imagesIdArray = formerPictures.map(item => {

						return item.id;
	
					});

					// NECESITAMOS SABER LOS ID DE IMAGENES ELIMINADAS

					const deletedIdArray = initialIdArray.filter(item => {

						return !imagesIdArray.includes(item);

					});


					if (deletedIdArray.length > 0) {

						// AHORA ESTOS ID IMAGES HAY QUE MANDARLOS A ELIMINAR AL SERVIDOR

						options = {
							method: 'DELETE',
							credentials: 'include',
							mode: 'cors'					
						};
	
						query = {
	
							filter: JSON.stringify({
								ids: deletedIdArray
							})
	
						};
	
						qs = new URLSearchParams(query).toString();
	
	
						url = `${apiURL}categories/sub/${subcategoryId}/images/many?${qs}`;
	
						return fetch(url, options).then(resp => resp.json());	


					}

					return Promise.resolve();


				}).then(res => {

					// UNA VEZ QUE YA ESTÁN ELIMINADAS LAS IMÁGENES, AHORA NOS TOCA ACTUALIZAR LOS DATOS MODIFICADOS EN EL SERVIDOR

					const { code, name, description, category } = params.data;

					const data = {

						filter: {
							code,
							name,
							description,
							category
						}
					};

					options = {
						method: 'PUT',
						credentials: 'include',
						mode: 'cors',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)					
					};
										
					url = `${apiURL}categories/sub/${subcategoryId}`;

					return fetch(url, options).then(resp => resp.json());

				})
					.then(res => {

						if (newPictures.length > 0) {

							// AHORA VAMOS A CREAR UN FORM DATA PARA ENVIAR TODAS LAS IMÁGENES NUEVAS AL SERVIDOR
							const formData = new FormData();
						
							for (let i = 0; i < newPictures.length; i++) {
								formData.append('images', newPictures[i].rawFile); // SOLO ENVIAMOS EL rawFile
							}
	
							options = {
								method: 'POST',
								credentials: 'include',
								mode: 'cors',
								body: formData					
							};
		
							url = `${apiURL}categories/sub/${subcategoryId}/images/all`;
	
							return fetch(url, options).then(resp => resp.json());
							
						} 

						return Promise.resolve(res);
					
					})
					.then(json => {

						const subcategoryObj = json.data.subcategory;
						
						return Promise.resolve({
							data: {
								id: subcategoryObj._id,
								...subcategoryObj
							}

						});


					});

			}

			// ESTO SE EJECUTA EN CASO DE QUE EL ITEM NO TENGA IMÁGENES, OSEA QUE EL CÓDIGO DE ARRIBA NO SE EJECUTA

			const { id: subcategoryId } = params.data; // ID DE LA CATEGORÍA

			const imagesIdArray = params.data.images;

			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};

			query = {

				filter: JSON.stringify({
					ids: imagesIdArray
				})

			};

			qs = new URLSearchParams(query).toString();


			url = `${apiURL}categories/sub/${subcategoryId}/images/many?${qs}`;

			return fetch(url, options).then(resp => resp.json()).then(res => {

				const data = {

					filter: {
						...params.data,
						images: []
					}
					
				};

				options = {
					method: 'PUT',
					credentials: 'include',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)					
				};


				url = `${apiURL}categories/sub/${subcategoryId}`;


				return fetch(url, options).then(resp => resp.json());


			}).then(json => {

				const subcategoryObj = json.data.subcategory;

				return Promise.resolve({
					data: {
						id: subcategoryObj._id,
						...subcategoryObj
					}
				});

			});
		}
		
		if (type === 'DELETE' && resource === 'subdepartments') { // ******* OPERACIONES DELETE con categories 

			// PRIMERO QUE NADA HAY QUE ELIMINAR EN EL SERVIDOR TODAS LAS IMÁGENES DE LA CATEGORÍA

			const { id: subcategoryId } = params;
			
			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};
			
			url = `${apiURL}categories/sub/${subcategoryId}`;

			return fetch(url, options).then(res => res.json()).then(json => {

				return Promise.resolve({
					data: {
						id: json.data.subcategory._id,
						...json.data.subcategory
					}
				});

			});

		}

		if (type === 'DELETE_MANY' && resource === 'subdepartments') { // ******* OPERACIONES DELETE_MANY con categories

			const { ids } = params;
			
			/* PRIMERO QUE NADA, USANDO LOS IDS, MANDAMOS A ELIMINAR TODAS LAS IMÁGES DE LAS CATEGORÍAS */

			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};

			query = {
				filter: JSON.stringify({ ids: params.ids })
			};

			qs = new URLSearchParams(query).toString();
			
			url = `${apiURL}categories/sub/many?${qs}`;

			
			return fetch(url, options).then(() => {

				return Promise.resolve({
					data: ids
				});

			});	


		}

		if (type === 'CREATE' && resource === 'subdepartments') {

			// notice that following condition can be true only when `<ImageInput source="pictures" />` component has parameter `multiple={true}`
			// if parameter `multiple` is false, then data.pictures is not an array, but single object

			if (params.data.pictures && params.data.pictures.length) {

				// only freshly dropped pictures are instance of File
				
				const newPictures = params.data.pictures.filter(p => p.rawFile instanceof File);

				// ACTUALIZAMOS PRIMERO LOS DATOS DE LA NUEVA SUBCATEGORÍA

				const { code, name, description, category } = params.data;

				const categoryId = category;

				const data = {

					filter: {
						code,
						name,
						description
					}
				};

				options = {
					method: 'POST',
					credentials: 'include',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)					
				};
									
				url = `${apiURL}categories/${categoryId}/sub`;

				return fetch(url, options).then(res => res.json()).then(json => {

					const { subcategory: subcategoryObj } = json.data;

					const { _id: subcategoryId } = subcategoryObj;

					// AHORA VAMOS A CREAR UN FORM DATA PARA ENVIAR TODAS LAS IMÁGENES NUEVAS AL SERVIDOR
					const formData = new FormData();
						
					for (let i = 0; i < newPictures.length; i++) {
						formData.append('images', newPictures[i].rawFile); // SOLO ENVIAMOS EL rawFile
					}

					options = {
						method: 'POST',
						credentials: 'include',
						mode: 'cors',
						body: formData					
					};

					url = `${apiURL}categories/sub/${subcategoryId}/images/all`;
						
					return fetch(url, options).then(res => res.json());

				}).then(json => {

					const subcategoryObj = json.data.subcategory;
						
					return Promise.resolve({
						data: {
							id: subcategoryObj._id,
							...subcategoryObj
						}

					});


				});

			}

			// SI NO HAY IMÁGENES, SOLO ACTUALIZAMOS LOS DATOS

			const { code, name, description, category } = params.data;

			const categoryId = category;

			const data = {

				filter: {
					code,
					name,
					description
				}
			};

			options = {
				method: 'POST',
				credentials: 'include',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)					
			};
							
			url = `${apiURL}categories/${categoryId}/sub`;


			return fetch(url, options).then(res => res.json()).then(json => {
				
				const subcategoryObj = json.data.subcategory;
				
				return Promise.resolve({
					data: {
						id: subcategoryObj._id,
						...subcategoryObj
					}

				});


			});


		}

		if (type === 'GET_ONE' && resource === 'items') { // SOLO PARA OPERACIONES GET_ONE CON categories

			/* LA IDEA ES: CUANDO SE HAGA CLICK EN EL BOTÓN EDITAR CATEGORIA, react-admin HACE UN GET_ONE PARA PEDIR
			EL DOCUMENTO AL SERVIDOR (RECORD), PERO EN EL DOCUMENTO VIENE LA PROPIEDAD images QUE ES SOLO UN ARRAY DE ids
			ENTONCES QUEREMOS SOLICITAR TODAS ESAS IMÁGENES AL SERVIDOR PARA PONERLAS DISPONIBLES EN EL OBJETO CATEGORÍA
			Y QUE PUEDAN VERSE LAS IMÁGENES EN EL ADMIN   */

			// PRIMERO DEBEMOS BUSCAR EL categoryObj..
	
			let itemObj = {};

			const { id } = params;

			url = `${apiURL}items/${id}`;

			options = {
				method: 'GET',
				credentials: 'include',
				mode: 'cors'									
			};

			return fetch(url, options).then(res => {

				return res.json();

			}).then(res => {

				itemObj = res.data.item; // YA TENEMOS EL categoryObj, AHORA VAMOS A SOLICITAR LAS IMÁGENES AL SERVIDOR.

				const imagesIdArray = res.data.item.images; // ESTO ES EL ARRAY CON LOS ID DE LAS IMÁGENES
			
			
				if (imagesIdArray.length > 0) {

					options = {
						method: 'GET',
						credentials: 'include',
						mode: 'cors'					
					};
	
					query = {
						filter: JSON.stringify({ ids: imagesIdArray })
					};
	
					qs = new URLSearchParams(query).toString();
	
					url = `${apiURL}items/images/many?${qs}`;
	
					return fetch(url, options).then(response => response.json()); // SOLICITAMOS LAS IMÁGENES AL SERVIDOR

				}

				throw new Error();
								

			}).then(res => {

				const imagesArray = res.data; // VIENEN LAS IMÁGENES COMO UN ARRAY [{ _id: xxx, image: _Buffer_ }]

				let outputArray = [];
				
				if (imagesArray) {

					outputArray = imagesArray.map(item => { // LO CONVERTIMOR A UN ARRAY ASI [{id: xxxx, url: xxxx},...]

						return {
							id: item._id,
							url: URL.createObjectURL(new Blob([Buffer.from(item.image)]))
						};
	
					});	

				}
				
				// AHORA AÑADIMOS ESTE ARRAY CON LAS IMÁGENES AL OBJETO categoryObject
			
				itemObj = {
					...itemObj,
					pictures: outputArray		
				};

				const { price } = itemObj;

				const price2 = parseFloat(price.$numberDecimal);


				// RECUERDEN QUE LA FUNCIÓN DEBE DEVOLVER UNA PROMESA CON LA DATA EN EL FORMATO QUE ACEPTA REACT ADMIN
				/* QUÉ ESTAMOS HACIENDO??? DARLE A REACT ADMIN UN OBJETO data QUE TIENE TODA LA DATA DE LA CATEGORÍA,
				CON UNA PROPIEDAD ADICIONAL pictures LA CUAL CONTIENE UN ARRAY DE LA FORMA [{id: xxx, url: xxx }] EL CUAL
				ME PERMITE VISUALIZAR TODAS LAS IMÁGENES EXISTENTES EN EL MODO DE EDICIÓN, Y PODERLAS ELIMINAR SI QUIERO */
				
				const data = {
					id: itemObj._id,
					...itemObj,
					price: price2
				};
					console.log('ESTOY AQUÍ!!!!!');
					console.log('DATA :', data);						
				return Promise.resolve({ 
					data
				});

			})
				.catch(e => {
								
					itemObj = {
						...itemObj,
						pictures: []		
					};
					
					const { price } = itemObj;

					const price2 = parseFloat(price.$numberDecimal);


					// RECUERDEN QUE LA FUNCIÓN DEBE DEVOLVER UNA PROMESA CON LA DATA EN EL FORMATO QUE ACEPTA REACT ADMIN
					/* QUÉ ESTAMOS HACIENDO??? DARLE A REACT ADMIN UN OBJETO data QUE TIENE TODA LA DATA DE LA CATEGORÍA,
					CON UNA PROPIEDAD ADICIONAL pictures LA CUAL CONTIENE UN ARRAY DE LA FORMA [{id: xxx, url: xxx }] EL CUAL
					ME PERMITE VISUALIZAR TODAS LAS IMÁGENES EXISTENTES EN EL MODO DE EDICIÓN, Y PODERLAS ELIMINAR SI QUIERO */
				
					return Promise.resolve({ 
						data: {
							id: itemObj._id,
							...itemObj,
							price: price2
						}
					});

				});	


		}
		
		if (type === 'UPDATE' && resource === 'items') { // *******OPERACIONES UPDATE  con categories

			/* ESTO SE EJECUTA JUSTO AL PRESIONAR EL BOTÓN SAVE EN EL MODO DE EDICIÓN, LA IDEA ES BUSCAR LAS IMÁGENES
			QUE FUERON AGREGADAS. RECUERDEN QUE EN GET_ONE (ARRIBA) NOSOTROS CREAMOS UNA PROPIEDAD pictures QUE ES UN ARRAY
			DE OBJECTOS [{id: xxx, url: xxx }] CON EL FIN DE PODER VER TODAS LAS IMÁGENES EN MODO EDICIÓN. ENTONCES, EL COMPONENTE ImageInput QUE ESTÁ EN TODOS LOS EDIT Y CREATE, CUANDO
			SE AGREGAN ARCHIVOS DE IMAGEN NUEVOS, AÑADE UNA PROPIEDAD rawFile A CADA OBJETO DEL ARRAY ANTERIOR, OSEA
			QUE pictures AHORA SERÁ [{id: xxx, url: xxx, rawFile: _File_ }]. rawFile SERÁ UN File CUANDO SEA UN ARCHIVO NUEVO,
			Y SERÁ Undefined CUANDO SE TRATE DE UN ARCHIVO EXISTENTE. ENTONCES LO QUE HACEMOS ES IDENTIFICAR ESOS ARCHIVOS
			NUEVOS PARA ALMACENARLOS EN EL SERVIDOR, ASOCIADOS CON EL categoryId  */

			// notice that following condition can be true only when `<ImageInput source="pictures" />` component has parameter `multiple={true}`
			// if parameter `multiple` is false, then data.pictures is not an array, but single object
			
			if (params.data.pictures && params.data.pictures.length > 0) {
				// only freshly dropped pictures are instance of File
				
				const { id: itemId } = params.data; // ID DE LA CATEGORÍA
				
				const formerPictures = params.data.pictures.filter(p => !(p.rawFile instanceof File));

            	const newPictures = params.data.pictures.filter(p => p.rawFile instanceof File);
				
				/* PRIMERO QUE NADA HAY QUE IDENTIFICAR LAS IMÁGENES YA EXISTENTES QUE FUERON ELIMINADAS, PARA ELLO
				HAY QUE HACER UN FETCH AL SERVIDOR PARA DETERMINAR EL ARRAY DE ID DE IMÁGENES INICIAL, Y COMPARARLO CON
				EL ARRAY ACTUAL */

				options = {
					method: 'GET',
					credentials: 'include',
					mode: 'cors'					
				};

				url = `${apiURL}items/${itemId}`;
				
				return fetch(url, options).then(res => res.json()).then(res => {


					const initialIdArray = res.data.item.images;

					const imagesIdArray = formerPictures.map(item => {

						return item.id;
	
					});

					// NECESITAMOS SABER LOS ID DE IMAGENES ELIMINADAS

					const deletedIdArray = initialIdArray.filter(item => {

						return !imagesIdArray.includes(item);

					});

										
					if (deletedIdArray.length > 0) {
						
						// AHORA ESTOS ID IMAGES HAY QUE MANDARLOS A ELIMINAR AL SERVIDOR

						options = {
							method: 'DELETE',
							credentials: 'include',
							mode: 'cors'					
						};
	
						query = {
	
							filter: JSON.stringify({
								ids: deletedIdArray
							})
	
						};
	
						qs = new URLSearchParams(query).toString();
	
	
						url = `${apiURL}items/${itemId}/images/many?${qs}`;
	
						return fetch(url, options).then(resp => resp.json());	


					}

					return Promise.resolve(null);

				}).then(json => {

					// UNA VEZ QUE YA ESTÁN ELIMINADAS LAS IMÁGENES, AHORA NOS TOCA ACTUALIZAR LOS DATOS MODIFICADOS EN EL SERVIDOR
					let data = {};

					if (json) {

						data = {

							filter: {
								...params.data,
								images: json.data.item.images
							}
						};

					} else {

						data = {
							filter: params.data
						};

					}					

					options = {
						method: 'PUT',
						credentials: 'include',
						mode: 'cors',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)					
					};
										
					url = `${apiURL}items/${itemId}`;
					
					return fetch(url, options).then(resp => resp.json());
			
				})
					.then(json => {
							
						if (newPictures.length > 0) {

							// AHORA VAMOS A CREAR UN FORM DATA PARA ENVIAR TODAS LAS IMÁGENES NUEVAS AL SERVIDOR
							const formData = new FormData();
						
							for (let i = 0; i < newPictures.length; i++) {
								formData.append('images', newPictures[i].rawFile); // SOLO ENVIAMOS EL rawFile
							}
	
							options = {
								method: 'POST',
								credentials: 'include',
								mode: 'cors',
								body: formData					
							};
		
							url = `${apiURL}items/${itemId}/images/all`;
							
							return fetch(url, options).then(res => res.json());
		

						}

						return Promise.resolve(json);					
				
					})
					.then(json => {

						const itemObj = json.data.item;
						
						return Promise.resolve({
							data: {
								id: itemObj._id,
								...itemObj
							}

						});

					});


			} 

			// ESTO SE EJECUTA EN CASO DE QUE EL ITEM NO TENGA IMÁGENES, OSEA QUE EL CÓDIGO DE ARRIBA NO SE EJECUTA

			const { id: itemId } = params.data; // ID DE LA CATEGORÍA

			const imagesIdArray = params.data.images;

			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};

			query = {

				filter: JSON.stringify({
					ids: imagesIdArray
				})

			};

			qs = new URLSearchParams(query).toString();


			url = `${apiURL}items/${itemId}/images/many?${qs}`;

			return fetch(url, options).then(resp => resp.json()).then( res => {

				const data = {

					filter: {
						...params.data,
						images: []
					}
					
				};

				options = {
					method: 'PUT',
					credentials: 'include',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)					
				};


				url = `${apiURL}items/${itemId}`;


				return fetch(url, options).then(resp => resp.json());


			}).then(json => {

				const itemObj = json.data.item;

				return Promise.resolve({
					data: {
						id: itemObj._id,
						...itemObj
					}
				});

			});


		}

		if (type === 'DELETE' && resource === 'items') { // ******* OPERACIONES DELETE con categories 

			// PRIMERO QUE NADA HAY QUE ELIMINAR EN EL SERVIDOR TODAS LAS IMÁGENES DE LA CATEGORÍA

			const { id: itemId } = params;
			
			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};
			
			url = `${apiURL}items/${itemId}`;

			return fetch(url, options).then(res => res.json()).then(json => {

				return Promise.resolve({
					data: {
						id: json.data.item._id,
						...json.data.item
					}
				});

			});

		}
				
		if (type === 'DELETE_MANY' && resource === 'items') { // ******* OPERACIONES DELETE_MANY con categories

			const { ids } = params;
			
			/* PRIMERO QUE NADA, USANDO LOS IDS, MANDAMOS A ELIMINAR TODAS LAS IMÁGES DE LAS CATEGORÍAS */

			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};

			query = {
				filter: JSON.stringify({ ids: params.ids })
			};

			qs = new URLSearchParams(query).toString();
			
			url = `${apiURL}items/many?${qs}`;

			
			return fetch(url, options).then(() => {

				return Promise.resolve({
					data: ids
				});

			});	


		}

		if (type === 'CREATE' && resource === 'items') {

			// notice that following condition can be true only when `<ImageInput source="pictures" />` component has parameter `multiple={true}`
			// if parameter `multiple` is false, then data.pictures is not an array, but single object
			
			if (params.data.pictures && params.data.pictures.length) {

				// only freshly dropped pictures are instance of File
				
				const newPictures = params.data.pictures.filter(p => p.rawFile instanceof File);
			

				// ACTUALIZAMOS PRIMERO LOS DATOS DE LA NUEVA SUBCATEGORÍA
				
				const data = {

					filter: params.data
				};

				options = {
					method: 'POST',
					credentials: 'include',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)					
				};
									
				url = `${apiURL}items`;
				
				return fetch(url, options).then(res => res.json()).then(json => {

					const { item: itemObj } = json.data;

					const { _id: itemId } = itemObj;

					// AHORA VAMOS A CREAR UN FORM DATA PARA ENVIAR TODAS LAS IMÁGENES NUEVAS AL SERVIDOR
					const formData = new FormData();
						
					for (let i = 0; i < newPictures.length; i++) {
						formData.append('images', newPictures[i].rawFile); // SOLO ENVIAMOS EL rawFile
					}

					options = {
						method: 'POST',
						credentials: 'include',
						mode: 'cors',
						body: formData					
					};
					
					url = `${apiURL}items/${itemId}/images/all`;
					
					return fetch(url, options).then(res => res.json());

				}).then(json => {
					
					const itemObj = json.data.item;
						
					return Promise.resolve({
						data: {
							id: itemObj._id,
							...itemObj
						}

					});


				});


			} 


			// SI NO HAY IMÁGENES, SOLO ACTUALIZAMOS LOS DATOS
				
			const data = {

				filter: params.data
			};

			options = {
				method: 'POST',
				credentials: 'include',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)					
			};
			console.log('DATA :', data);					
			url = `${apiURL}items`;


			return fetch(url, options).then(res => res.json()).then(json => {
				
				const itemObj = json.data.item;
				
				return Promise.resolve({
					data: {
						id: itemObj._id,
						...itemObj
					}

				});


			});

		}

		if (type === 'GET_LIST' && resource === 'items') {
			
			const { page, perPage } = params.pagination;
			const { field, order } = params.sort;
			
			query = {
				page,
				limit: perPage,
				sort: JSON.stringify({
					field,
					order
				}),
				filter: JSON.stringify(params.filter)
			};
	
			qs = new URLSearchParams(query).toString();

			options = {
				method: 'GET',
				credentials: 'include',
				mode: 'cors'
			}; 
	
			url = `${apiURL}items/admin?${qs}`;

			let headers = null;

			return fetch(url, options).then(res => {
				
				headers = res.headers;
			
				return res.json(); 
						
			}).then(json => {
				
				if (headers && !headers.has('content-range')) {
					throw new Error('The Content-Range header is missing in the HTTP Response.');
				}

				const outputData = json.data.results.docs.map(record => ({ id: record._id, ...record }));

				const outputData2 = outputData.map(record => {

					const { price } = record;

					const newPrice = parseFloat(price.$numberDecimal);

					return {
						...record,
						price: newPrice
					};

				});
				
				return Promise.resolve({
					data: outputData2,
					total: parseInt(headers.get('content-range'), 10)
				});

			});


		}
		
		if (type === 'GET_MANY_REFERENCE' && resource === 'items') {

			const { page, perPage } = params.pagination;
			const { field, order } = params.sort;
			
			query = {
				page,
				limit: perPage,
				sort: JSON.stringify({
					field,
					order
				}),
				filter: JSON.stringify({
					...params.filter,
					[params.target]: params.id
				})
			};
	
			qs = new URLSearchParams(query).toString();

			options = {
				method: 'GET',
				credentials: 'include',
				mode: 'cors'
			}; 
	
			url = `${apiURL}items/admin?${qs}`;

			let headers = null;

			return fetch(url, options).then(res => {
				
				headers = res.headers;
			
				return res.json(); 
						
			}).then(json => {

				if (!headers.has('content-range')) {
					throw new Error('The Content-Range header is missing in the HTTP Response.');
				}

				const outputData = json.data.results.docs.map(record => ({ id: record._id, ...record }));

				const outputData2 = outputData.map(record => {

					const { price } = record;

					const newPrice = parseFloat(price.$numberDecimal);

					return {
						...record,
						price: newPrice
					};

				});

				return Promise.resolve({
					data: outputData2,
					total: parseInt(headers.get('content-range'), 10)
				});

			});


		}


		// for other request types and resources, fall back to the default request handler
		return requestHandler(type, resource, params);

	};

};


export default addUploadFeature;
