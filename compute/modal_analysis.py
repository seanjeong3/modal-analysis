import sys
import json
import numpy as np
from scipy import linalg

# read arguments
def read_arg():
	_, dof, m, k = sys.argv
	dof = int(dof)
	m = [float(s) for s in m.split(',')]
	k = [float(s) for s in k.split(',')]
	return dof,m,k

# configure mass and stiffness matrices
def configure_matrix(m,k):
	M = np.diag(m)
	K = np.diag(k)
	for i in range(dof-1):
		K[i,i] += k[i+1]
		K[i,i+1] -= k[i+1]
		K[i+1,i] -= k[i+1]
	return M,K

def compute_eigen(M,K):
	# get eigenvalue w and eigenvector v
	# w,v = np.linalg.eig(np.matmul(K, np.linalg.inv(M)))
	w,v = linalg.eig(K,M)
	idx = w.argsort() 
	w = np.real(w[idx])
	v = v[:,idx]
	# sqrt eigenvalues to get natural frequency wn
	w = np.sqrt(w)
	# Normalize eigenvector
	for i in range(dof):
		absMaxIdx = max(range(dof), key=lambda x: abs(v[x,i]))
		absMaxVal = v[absMaxIdx,i]
		v[:,i] = v[:,i] / absMaxVal
	v = np.transpose(v)
	return w,v

if __name__ == "__main__":
	dof,m,k = read_arg()
	M,K = configure_matrix(m,k)
	w,v = compute_eigen(M,K)
	# return result in json via stdout
	print(json.dumps({"freq": w.tolist(), "mode": v.tolist()}))
