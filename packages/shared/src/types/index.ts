export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestSet {
  id: string;
  name: string;
  description?: string;
  json_extraction_key?: string;
  categories?: GroundTruthCategory[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroundTruthCategory {
  id: string;
  test_set_id: string;
  name: string;
  description: string;
}

export interface Evaluation {
  id: string;
  testSetId: string;
  modelId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  results?: unknown;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}