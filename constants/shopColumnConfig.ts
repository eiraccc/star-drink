export type shopColumnType = {
    key: string,
    label: string
};

export const shopColumns: shopColumnType[] = [
  { key: 'id', label: 'ID' },
  { key: 'nameEn', label: 'Shop Name (EN)' },
  { key: 'nameZh', label: 'Shop Name (ZH)' },
  { key: 'slug', label: 'Slug' },
  { key: 'alias', label: 'Alias' },
  { key: 'submittedName', label: 'Submitted Name' },
  { key: 'submittedNote', label: 'Submitted Note' },
  { key: 'submittedByEmail', label: 'Submitted By' },
  { key: 'description', label: 'Description' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'isApproved', label: 'Approval Status'},
];

export type ApprovalStatusType = 'all' | 'approved' | 'pending';

export const typeToInitColumnsMap:any = {
  pending: ['nameEn', 'nameZh', 'slug', 'submittedName', 'submittedByEmail', 'submittedNote', 'createdAt', 'isApproved'],
  approved: ['nameEn', 'nameZh', 'slug', 'alias', 'createdAt', 'isApproved'],
  all: ['id', 'nameEn', 'nameZh', 'slug', 'alias', 'createdAt', 'updatedAt',  'isApproved'],
};