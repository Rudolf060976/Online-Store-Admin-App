
		if (type === 'DELETE_MANY' && resource === 'items') { // ******* OPERACIONES DELETE_MANY con categories

			const { ids } = params;

			/* PRIMERO QUE NADA, USANDO LOS IDS, MANDAMOS A ELIMINAR TODAS LAS IMÁGES DE LAS CATEGORÍAS */

			const fetchArray = [];

			options = {
				method: 'DELETE',
				credentials: 'include',
				mode: 'cors'					
			};
			

			for (let i = 0; i < ids.length; i++ ) {

				fetchArray.push(fetch(`${apiURL}items/${ids[i]}/images/all`, options));

			}

			return Promise.all(fetchArray).then(results => {

				const fetchArray2 = [];

				for (let j = 0; j < ids.length; j++) {

					fetchArray2.push(fetch(`${apiURL}items/${ids[j]}`, options));
	
				}

				return Promise.all(fetchArray2);

			}).then(results => {

				return Promise.resolve({
					data: ids
				});

			});


		}
