import { useSelector } from 'react-redux';

const FixedBottomNavigation = ({forwardFunctions, backwardFunction, forwardLabels, backwardDisabled, forwardDisableds}) => {
	const { primaryColor } = useSelector(store => store.colorStore);

	if (!forwardFunctions && !backwardFunction) {
		return <></>
	}

	return <>
		<div className='py-3 my-5' />
		<div className={`w-100 bg-${primaryColor} py-4`} style={{position: 'fixed', bottom: 0, left: 0, borderTop: `2px solid var(--charcoal-40)`}}>
			<div style={{position: 'relative'}}>
				<div className='btn' style={{color: `var(--${primaryColor})`}} disabled={true}>
					{
						// Makes room for the other buttons
						"_"
					}
				</div>
				{backwardFunction &&
					<div
						style={{position: 'absolute', left: '5rem', width: '10vw'}}
						className='border-stimorol btn rounded-rair p-0'>
						<button
							style={{border: 'none'}}
							disabled={backwardDisabled}
							className={`btn rounded-rair w-100 btn-${primaryColor}`}
							onClick={backwardFunction}>
							Back
						</button>
					</div>
				}
				<div style={{position: 'absolute', right: '5rem', display: 'inline-block'}}>
					{forwardFunctions && forwardFunctions.length && forwardFunctions.map((item, index) => {
						return <div key={index}	className='border-stimorol rounded-rair btn p-0 mx-2'>
									<button
										style={{border: 'none'}}
										disabled={item.disabled}
										className='btn rounded-rair btn-stimorol'
										onClick={item.action}>
										{item.label ? item.label : 'Proceed'}
									</button>
								</div>
						})
					}
				</div>
			</div>
		</div>
	</>
}

export default FixedBottomNavigation;