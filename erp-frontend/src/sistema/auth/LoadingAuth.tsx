import LinearProgress from '@mui/material/LinearProgress';

export const LoadingAuth = ()=>{
    return (
        <LinearProgress sx={{
            backgroundColor: 'gray',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#0c2846'
            }
          }} className="authing_page"/>
    );
}